import jwt from 'jsonwebtoken';
import { env } from 'config/env.config';
import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from 'lib/asyncHandler';
import { UnauthorizedError } from 'lib/errors';
import Logger from 'lib/logger';
import { ApiResponse } from 'lib/response';
import type { AuthRequest } from 'middlewares/auth.middleware';
import refreshTokenModel from 'models/refreshToken.model';

export const logoutController = asyncHandler(async (req: AuthRequest, res: Response) => {
	const userId = req.user!.userId;
	const refreshToken = req.cookies?.['refreshToken'];

	Logger.info(`Logout attempt for user: ${userId}`);
	if (!refreshToken) {
		Logger.error(`No refresh token provided for user: ${userId}`);
		throw new UnauthorizedError('Unauthorized');
	}

	try {
		jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET_KEY);
	} catch (err) {
		Logger.error(`Invalid or expired refresh token for user: ${userId}`, (err as Error).message);
		throw new UnauthorizedError('Unauthorized');
	}

	// Revoke only the current sessions refresh token
	const result = await refreshTokenModel.updateOne(
		{ userId, token: refreshToken, isRevoked: false },
		{ isRevoked: true },
	);

	if (result.matchedCount === 0) {
		Logger.warn(`Refresh token not found or already revoked for user: ${userId}`);
	}

	// Clear cookies
	res.clearCookie('accessToken', {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 0,
	});

	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 0,
	});

	Logger.info(`User logged out successfully: ${userId}`);

	return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, 'Logout successfully'));
});
