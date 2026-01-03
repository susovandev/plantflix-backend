import type { Request, Response } from 'express';
import { asyncHandler } from 'lib/asyncHandler';
import { InternalServerError, UnauthorizedError } from 'lib/errors';
import { env } from 'config/env.config';
import { ApiResponse } from 'lib/response';
import { StatusCodes } from 'http-status-codes';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from 'constants/auth/auth.constants';
import { signAccessAndRefreshToken, verifyRefreshToken } from 'helper/token.helper';
import userModel, { AccountStatus } from 'models/user.model';
import refreshTokenModel, { IRefreshTokenDocument } from 'models/refreshToken.model';
import Logger from 'lib/logger';

export interface IDecodedToken {
	sub: string;
	role: string;
	iat: number;
	exp: number;
}

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
	// TODO: Get refresh token from cookies
	const oldToken = req.cookies['refreshToken'];
	const ipAddress =
		req.ip || (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
	const userAgent = req.get('user-agent') ?? 'unknown';

	Logger.info(`Refresh token request received with ip address: ${ipAddress}`);

	if (!oldToken) {
		Logger.warn('No refresh token found');
		throw new UnauthorizedError('Unauthorized');
	}

	// TODO: Verify refresh token
	const decoded = verifyRefreshToken(oldToken) as IDecodedToken;
	if (!decoded) {
		Logger.warn('Invalid refresh token');
		throw new UnauthorizedError('Unauthorized');
	}

	// TODO: Check if refresh token is valid
	const storedToken = (await refreshTokenModel.findOne({
		userId: decoded.sub,
		token: oldToken,
		isRevoked: false,
	})) as IRefreshTokenDocument;

	// TODO: Check if refresh token is revoked or expired
	if (!storedToken) {
		await refreshTokenModel.updateMany({ userId: decoded.sub }, { isRevoked: true });
		throw new UnauthorizedError('Session compromised');
	}

	if (storedToken.expiredAt < new Date()) {
		Logger.warn('Refresh token has expired');
		throw new UnauthorizedError('Session expired');
	}

	// TODO: Check if user is active
	const user = await userModel.findById(decoded.sub);
	if (!user || user.accountStatus !== AccountStatus.ACTIVE) {
		Logger.warn('User is inactive');
		throw new UnauthorizedError('Unauthorized');
	}

	// TODO: Revoke old refresh token
	storedToken.isRevoked = true;
	await storedToken.save();

	const { accessToken, refreshToken: newRefreshToken } = signAccessAndRefreshToken(user);

	const newRefreshTokenDoc = await refreshTokenModel.create({
		userId: user._id,
		token: newRefreshToken,
		expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
		ipAddress,
		userAgent,
	});

	if (!newRefreshTokenDoc) {
		Logger.warn('Failed to create new refresh token');
		throw new InternalServerError('Could not refresh token');
	}

	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: ACCESS_TOKEN_TTL,
	});

	res.cookie('refreshToken', newRefreshToken, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: REFRESH_TOKEN_TTL,
	});

	return res
		.status(StatusCodes.OK)
		.json(new ApiResponse(StatusCodes.OK, 'Token refreshed successfully'));
});
