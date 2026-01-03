import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from 'lib/errors';
import { IDecodedToken } from 'modules/auth/controllers/refreshToken.controller';
import Logger from 'lib/logger';
import { verifyAccessToken } from 'helper/token.helper';

export const AuthCheck = async (req: Request, _res: Response, next: NextFunction) => {
	Logger.info(`Auth Request received with ip address: ${req.ip}`);

	const accessToken = req.cookies['accessToken'];

	if (!accessToken) {
		Logger.warn('No access token provided in cookies');
		throw new UnauthorizedError('Unauthorized');
	}

	// TODO: Verify access token
	const decodedToken = verifyAccessToken(accessToken) as IDecodedToken;

	if (!decodedToken) {
		Logger.warn('Invalid access token');
		throw new UnauthorizedError('Unauthorized');
	}

	req.user = {
		userId: decodedToken.sub,
		role: decodedToken.role,
	};

	Logger.debug(`User authenticated with userId: ${req.user.userId}`);
	next();
};
