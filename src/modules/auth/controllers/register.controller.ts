import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { asyncHandler } from 'lib/asyncHandler';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from 'lib/response';
import { IRegisterBody } from '../types/auth.types';
import verificationCodeModel, {
	VerificationCodeStatus,
	VerificationCodeType,
} from 'models/verificationCode.model';
import { ConflictError, InternalServerError } from 'lib/errors';
import { hashPassword } from 'helper/password.helper';
import { registerEmailTemplate } from 'templates/auth/registerMail.template';
import { emailQueue } from 'jobs/queues/email.queue';
import { VERIFICATION_CODE_EXPIRATION_TIME } from 'constants/auth/auth.constants';
import emailModel, { EmailSource, EmailStatus } from 'models/email.model';
import userModel, { AccountStatus } from 'models/user.model';
import getRandomOTP from 'helper/otp.helper';
import Logger from 'lib/logger';

export const registerController = asyncHandler(
	async (req: Request<object, object, IRegisterBody>, res: Response) => {
		const { name, email, password } = req.body;
		const normalizedEmail = email.toLowerCase();

		Logger.info(`Register attempt for email: ${normalizedEmail}`);

		//? TODO: check if email exists in db
		const user = await userModel.findOne({ email: normalizedEmail });
		if (user) {
			Logger.warn(`Registration blocked: email already exists - ${normalizedEmail}`);
			throw new ConflictError('An account with this email already exists');
		}

		//* Start MongoDB session
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			//? Todo: Hash password
			const hashedPassword = await hashPassword(password);
			if (!hashedPassword) {
				Logger.warn(`Password hashing failed for email: ${normalizedEmail}`);
				throw new InternalServerError('Failed to hash password');
			}

			//? Todo: Create user
			const [newUser] = await userModel.insertMany(
				[
					{
						name,
						email: normalizedEmail,
						passwordHash: hashedPassword,
						accountStatus: AccountStatus.PENDING,
						accountVerified: false,
					},
				],
				{ session },
			);
			if (!newUser) {
				Logger.warn(`User creation failed for email: ${normalizedEmail}`);
				throw new InternalServerError('Failed to create user');
			}

			Logger.info(`User created successfully with email: ${normalizedEmail}`);

			//? Todo: Generate verification code and store in db
			const code = getRandomOTP();
			const [verificationCode] = await verificationCodeModel.insertMany(
				[
					{
						userId: newUser._id,
						code: code,
						verificationStatus: VerificationCodeStatus.PENDING,
						type: VerificationCodeType.ACCOUNT_ACTIVATION,
						expiredAt: new Date(Date.now() + VERIFICATION_CODE_EXPIRATION_TIME),
					},
				],
				{ session },
			);

			if (!verificationCode) {
				Logger.warn(`Verification code creation failed for email: ${normalizedEmail}`);
				throw new InternalServerError('Failed to create verification code');
			}

			Logger.info(`Verification code created successfully with email: ${normalizedEmail}`);

			//? Todo: Create email and store in db
			const [emailDoc] = await emailModel.insertMany(
				[
					{
						recipient: newUser._id,
						recipientEmail: normalizedEmail,
						subject: 'Account activation code',
						body: registerEmailTemplate(name, code),
						source: EmailSource.SYSTEM,
						status: EmailStatus.PENDING,
					},
				],
				{ session },
			);

			if (!emailDoc) {
				Logger.warn(`Email creation failed for email: ${normalizedEmail}`);
				throw new InternalServerError('Failed to create email');
			}

			Logger.info(`Email created successfully with email: ${normalizedEmail}`);

			//* COMMIT TRANSACTION
			await session.commitTransaction();
			session.endSession();

			//? Todo: Send email with using email queue
			await emailQueue.add('send-email', {
				emailId: emailDoc._id.toString(),
			});

			return res
				.status(StatusCodes.CREATED)
				.json(
					new ApiResponse(
						StatusCodes.CREATED,
						`Account activation code sent to your email: ${normalizedEmail}`,
					),
				);
		} catch (error) {
			//* Rollback everything
			await session.abortTransaction();
			session.endSession();

			Logger.warn(`Registration transaction failed for ${normalizedEmail}`, error);
			throw error;
		}
	},
);
