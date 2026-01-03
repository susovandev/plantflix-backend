import { Request, Response } from 'express';
import { asyncHandler } from 'lib/asyncHandler';
import { IResendOtpBody } from '../types/auth.types';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'lib/errors';
import verificationCodeModel, {
	IVerificationCodeDocument,
	VerificationCodeStatus,
	VerificationCodeType,
} from 'models/verificationCode.model';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from 'lib/response';
import { resendOtpEmailTemplate } from 'templates/auth/resendOTP.template';
import { env } from 'config/env.config';
import {
	OTP_RESEND_COOLDOWN_TIME,
	VERIFICATION_CODE_EXPIRATION_TIME,
} from 'constants/auth/auth.constants';
import { EMAIL_QUEUE_ACTION_NAME } from 'constants/Jobs/job.constants';
import { emailQueue } from 'jobs/queues/email.queue';
import emailModel, { EmailSource, EmailStatus } from 'models/email.model';
import getRandomOTP from 'helper/otp.helper';
import mongoose from 'mongoose';
import userModel from 'models/user.model';
import Logger from 'lib/logger';

export const resendOTPController = asyncHandler(
	async (req: Request<object, object, IResendOtpBody>, res: Response) => {
		const { email } = req.body;
		const normalizedEmail = email.toLowerCase();

		Logger.info(`Resend OTP attempt for email: ${normalizedEmail}`);

		//? TODO: check if email exists in db
		const user = await userModel.findOne({ email: normalizedEmail });
		if (!user) {
			Logger.warn(`Resend OTP blocked: email not found - ${normalizedEmail}`);
			throw new NotFoundError(`Your account is not found`);
		}

		//? TODO: check if user has already verified account
		if (user.accountVerified) {
			Logger.warn(`Resend OTP blocked: account already verified - ${normalizedEmail}`);
			throw new ConflictError('Your account is already verified');
		}

		// ? TODO: check if user has recently requested an OTP
		const lastOtp = (await verificationCodeModel
			.findOne({
				userId: user._id,
				type: VerificationCodeType.ACCOUNT_ACTIVATION,
			})
			.sort({ createdAt: -1 })) as IVerificationCodeDocument;

		if (lastOtp && Date.now() - lastOtp?.createdAt.getTime() < OTP_RESEND_COOLDOWN_TIME) {
			throw new BadRequestError('Please wait before requesting another OTP');
		}

		//* Start MongoDB session
		const session = await mongoose.startSession();
		let emailDocId: string | null = null;

		try {
			session.startTransaction();
			// Todo: Updating all verification codes to expired
			await verificationCodeModel.updateMany(
				{
					userId: user._id,
					type: VerificationCodeType.ACCOUNT_ACTIVATION,
					verificationStatus: VerificationCodeStatus.PENDING,
				},
				{
					verificationStatus: VerificationCodeStatus.EXPIRED,
				},
				{ session },
			);

			const otp = getRandomOTP();
			const expiredAt = new Date(Date.now() + VERIFICATION_CODE_EXPIRATION_TIME);

			const [verificationCode] = await verificationCodeModel.create(
				[
					{
						userId: user._id,
						code: otp,
						type: VerificationCodeType.ACCOUNT_ACTIVATION,
						verificationStatus: VerificationCodeStatus.PENDING,
						expiredAt,
					},
				],
				{ session },
			);

			if (!verificationCode) {
				Logger.warn(`Verification code creation failed for email: ${email}`);
				throw new InternalServerError('Failed to create verification code');
			}

			const [emailDoc] = await emailModel.create(
				[
					{
						recipient: user._id,
						recipientEmail: email,
						subject: 'Your verification code',
						body: resendOtpEmailTemplate({
							firstName: user.name.split(' ')[0] as string,
							appName: env.APP_NAME,
							otp,
							expiryMinutes: VERIFICATION_CODE_EXPIRATION_TIME / (60 * 1000),
							supportEmail: env.SUPPORT_EMAIL,
							year: new Date().getFullYear(),
						}),
						source: EmailSource.SYSTEM,
						status: EmailStatus.PENDING,
					},
				],
				{ session },
			);

			if (!emailDoc) {
				Logger.warn(`Email creation failed for email: ${email}`);
				throw new InternalServerError('Failed to create email');
			}

			emailDocId = emailDoc._id.toString();

			await session.commitTransaction();
		} catch (error) {
			//* Rollback everything
			await session.abortTransaction();
			Logger.warn(`Resend transaction failed for ${normalizedEmail}`, error);
			throw error;
		} finally {
			await session.endSession();
		}

		await emailQueue.add(EMAIL_QUEUE_ACTION_NAME, {
			emailId: emailDocId,
		});

		return res
			.status(StatusCodes.OK)
			.json(new ApiResponse(StatusCodes.OK, 'OTP Resend successfully to your email'));
	},
);
