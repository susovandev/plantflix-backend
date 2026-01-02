import type { Request, Response } from 'express';
import { asyncHandler } from 'lib/asyncHandler';
import { ILoginBody } from '../types/auth.types';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from 'lib/response';
import Logger from 'lib/logger';
import userModel, { AccountStatus } from 'models/user.model';
import loginHistoryModel, { LoginAttemptStatus } from 'models/loginHistory.model';
import refreshTokenModel from 'models/refreshToken.model';
import { InternalServerError, UnauthorizedError } from 'lib/errors';
import { comparePassword } from 'helper/password.helper';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../../../constants';
import { env } from 'config/env.config';
import { signAccessAndRefreshToken } from 'helper/token.helper';

export interface ILogin {
	userId: string;
	ipAddress: string;
	userAgent: string;
	attemptStatus: LoginAttemptStatus;
}
export const trackingLoginHistory = async ({
	userId,
	ipAddress,
	userAgent,
	attemptStatus,
}: ILogin) => {
	const loginHistory = await loginHistoryModel.create({
		userId,
		ipAddress,
		userAgent,
		attemptStatus,
		lastAttemptAt: new Date(),
	});
	if (loginHistory.attemptStatus === 'success') {
		loginHistory.loginAt = new Date();
		await loginHistory.save();
	}
};

export const loginController = asyncHandler(
	async (req: Request<object, object, ILoginBody>, res: Response) => {
		const { email, password } = req.body;
		const normalizedEmail = email.toLowerCase();
		const ipAddress = req.ip ?? '0.0.0.0';
		const userAgent = req.headers['user-agent'] ?? 'Unknown';

		Logger.info(`Login attempt for email: ${normalizedEmail}`);
		// TODO: check if email exists in db
		const user = await userModel.findOne({ email: normalizedEmail });
		if (!user) {
			Logger.error(`Login attempt failed for email: ${normalizedEmail}`);
			throw new UnauthorizedError('Invalid email or password');
		}

		// TODO: Check password is correct
		const isPasswordValid = await comparePassword(password, user?.passwordHash);
		if (!isPasswordValid) {
			Logger.error(`Password validation failed for email: ${normalizedEmail}`);
			await trackingLoginHistory({
				userId: user._id.toString(),
				ipAddress,
				userAgent,
				attemptStatus: LoginAttemptStatus.FAILED,
			});
			throw new UnauthorizedError('Invalid email or password');
		}

		// TODO: Check if account is verified
		if (!user.accountVerified) {
			Logger.error(`User account is not verified for email: ${normalizedEmail}`);
			await trackingLoginHistory({
				userId: user._id.toString(),
				ipAddress,
				userAgent,
				attemptStatus: LoginAttemptStatus.FAILED,
			});
			throw new UnauthorizedError('Invalid email or password');
		}

		// TODO: Check if account is suspended
		if (user.accountStatus === AccountStatus.SUSPENDED) {
			Logger.error(`User account is suspended for email: ${normalizedEmail}`);
			await trackingLoginHistory({
				userId: user._id.toString(),
				ipAddress,
				userAgent,
				attemptStatus: LoginAttemptStatus.FAILED,
			});
			throw new UnauthorizedError('Your account already suspended');
		}

		// TODO: Check if account is active
		if (user && user.accountStatus !== AccountStatus.ACTIVE) {
			Logger.error(`User account is not active for email: ${normalizedEmail}`);
			await trackingLoginHistory({
				userId: user._id.toString(),
				ipAddress,
				userAgent,
				attemptStatus: LoginAttemptStatus.FAILED,
			});
			throw new UnauthorizedError('Your account is not active');
		}

		// TODO: Generate AccessToken and RefreshToken
		const { accessToken, refreshToken } = signAccessAndRefreshToken(user);
		if (!accessToken || !refreshToken) {
			Logger.error(`Failed to generate access and refresh token for email: ${normalizedEmail}`);
			throw new InternalServerError('Failed to generate access and refresh token');
		}

		// TODO: Store RefreshToken in db
		await refreshTokenModel.create({
			userId: user._id.toString(),
			tokenHash: refreshToken,
			expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
			ipAddress,
			userAgent,
		});

		// TODO: Update login history
		await trackingLoginHistory({
			userId: user._id.toString(),
			ipAddress,
			userAgent,
			attemptStatus: LoginAttemptStatus.SUCCESS,
		});

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: ACCESS_TOKEN_TTL,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: REFRESH_TOKEN_TTL,
		});

		return res
			.status(StatusCodes.OK)
			.json(new ApiResponse(StatusCodes.OK, 'Logged in successfully'));
	},
);
