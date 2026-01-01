import type { Request, Response } from 'express';
import { IVerifyOtpBody } from '../types/auth.types';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from 'lib/response';
import { asyncHandler } from 'lib/asyncHandler';
import Logger from 'lib/logger';
import userModel, { AccountStatus } from 'models/user.model';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'lib/errors';
import verificationCodeModel, {
	VerificationCodeStatus,
	VerificationCodeType,
} from 'models/verificationCode.model';
import emailModel, { EmailSource, EmailStatus } from 'models/email.model';
import { env } from 'config/env.config';
import { emailQueue } from 'jobs/queues/email.queue';
import { EMAIL_QUEUE_ACTION_NAME } from '../../../constants';
import { accountVerifiedTemplate } from 'templates/auth/accountVerified.template';

export const verifyOTPController = asyncHandler(
	async (req: Request<object, object, IVerifyOtpBody>, res: Response) => {
		const { email, code } = req.body;
		const normalizedEmail = email.toLowerCase();

		Logger.info(`Verify OTP attempt for email: ${normalizedEmail}`);
		//? TODO: check if email exists in db
		const user = await userModel.findOne({ email: normalizedEmail });

		if (!user) {
			Logger.error(`User not found for email: ${normalizedEmail}`);
			throw new NotFoundError('Your account is not found');
		}

		//? TODO: check if user has already verified account
		if (user.accountVerified || user.accountStatus !== AccountStatus.PENDING) {
			Logger.error(`Account already verified for email: ${normalizedEmail}`);
			throw new ConflictError('Your account is already verified');
		}

		//? TODO: check if code is valid
		const verificationCode = await verificationCodeModel.findOneAndUpdate(
			{
				userId: user?._id,
				code,
				type: VerificationCodeType.ACCOUNT_ACTIVATION,
				verificationStatus: VerificationCodeStatus.PENDING,
				expiredAt: { $gt: new Date() },
			},
			{
				verificationStatus: VerificationCodeStatus.USED,
				verifiedAt: new Date(),
			},
			{ new: true },
		);

		if (!verificationCode) {
			Logger.error(`Verification code not found for email: ${normalizedEmail}`);
			throw new BadRequestError('Invalid verification code or it has expired');
		}

		//? TODO: verify account and update in db
		await userModel.updateOne(
			{ _id: user._id },
			{
				accountStatus: AccountStatus.ACTIVE,
				accountVerified: true,
			},
		);

		//Todo: Send email with using email queue
		try {
			const emailDoc = await emailModel.create({
				recipient: user._id,
				recipientEmail: normalizedEmail,
				subject: 'Your account has been activated successfully',
				body: accountVerifiedTemplate({
					firstName: user.name.split(' ')[0] as string,
					appName: env.APP_NAME,
					loginUrl: env.LOGIN_URL,
					supportEmail: env.SUPPORT_EMAIL,
					year: new Date().getFullYear(),
				}),
				source: EmailSource.SYSTEM,
				status: EmailStatus.PENDING,
			});
			if (!emailDoc) {
				Logger.error(`Email creation failed for email: ${normalizedEmail}`);
				throw new InternalServerError('Failed to create email');
			}

			await emailQueue.add(EMAIL_QUEUE_ACTION_NAME, {
				emailId: emailDoc._id.toString(),
			});
		} catch (error) {
			Logger.error('Failed to enqueue account verified email');
			throw error;
		}

		Logger.info(`Account verified successfully for email: ${normalizedEmail}`);
		return res
			.status(StatusCodes.OK)
			.json(new ApiResponse(StatusCodes.OK, 'Account verified successfully'));
	},
);
