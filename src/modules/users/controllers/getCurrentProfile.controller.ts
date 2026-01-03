import type { Request, Response } from 'express';
import { asyncHandler } from '@/lib/asyncHandler';
import { UnauthorizedError } from '@/lib/errors';
import { sanitizeUserProfileResponse } from '../types/user.types';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '@/lib/response';
import userModel from '@/models/user.model';
import Logger from '@/lib/logger';

export const getCurrentUserProfileController = asyncHandler(async (req: Request, res: Response) => {
	// Todo: Validate req.user
	if (!req.user?.userId) {
		Logger.warn('Unauthorized profile access attempt (missing user)');
		throw new UnauthorizedError('Unauthorized');
	}

	const userId = req.user.userId;
	Logger.info(`Fetching profile for userId: ${userId}`);

	// Todo: Fetch user profile from DB
	const user = await userModel.findById(userId).lean().exec();

	if (!user) {
		Logger.warn(`User not found for userId: ${userId}`);
		throw new UnauthorizedError('Unauthorized');
	}

	// Todo: Sanitize user profile response
	const userProfileResponse = sanitizeUserProfileResponse(user);

	Logger.debug(`User profile sanitized for userId: ${userId}`);

	return res
		.status(StatusCodes.OK)
		.json(
			new ApiResponse(StatusCodes.OK, 'User profile fetched successfully', userProfileResponse),
		);
});
