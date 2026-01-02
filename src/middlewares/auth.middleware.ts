import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { env } from 'config/env.config';
import { UnauthorizedError } from 'lib/errors';
import { IDecodedToken } from 'modules/auth/controllers/refreshToken.controller';
import Logger from 'lib/logger';

export interface AuthRequest extends Request {
	user?: {
		userId: string;
	};
}
export const AuthCheck = async (req: AuthRequest, _res: Response, next: NextFunction) => {
	const accessToken = req.cookies['accessToken'];
	if (!accessToken) {
		throw new UnauthorizedError('Unauthorized');
	}

	// TODO: Verify access token
	let decodedToken: IDecodedToken;
	try {
		decodedToken = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET_KEY) as IDecodedToken;
	} catch (error) {
		Logger.error(`Error verifying access token: ${(error as Error).message}`);
		throw new UnauthorizedError('Unauthorized');
	}

	if (!decodedToken) {
		throw new UnauthorizedError('Unauthorized');
	}

	req.user = {
		userId: decodedToken.sub,
	};
	next();
};
