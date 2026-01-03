import jwt from 'jsonwebtoken';
import { IUserDocument } from 'models/user.model';
import { env } from 'config/env.config';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from 'constants/auth/auth.constants';
import Logger from 'lib/logger';

export interface ITokens {
	accessToken: string;
	refreshToken: string;
}
export const signAccessToken = (user: IUserDocument): string => {
	return jwt.sign({ sub: user._id, role: user.role }, env.ACCESS_TOKEN_SECRET_KEY, {
		expiresIn: ACCESS_TOKEN_TTL as jwt.JwtPayload['expiresIn'],
	});
};
export const signRefreshToken = (user: IUserDocument): string => {
	return jwt.sign({ sub: user._id, role: user.role }, env.REFRESH_TOKEN_SECRET_KEY, {
		expiresIn: REFRESH_TOKEN_TTL as jwt.JwtPayload['expiresIn'],
	});
};

export const signAccessAndRefreshToken = (user: IUserDocument): ITokens => {
	const accessToken = signAccessToken(user);
	const refreshToken = signRefreshToken(user);
	return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): jwt.JwtPayload => {
	try {
		return jwt.verify(token, env.ACCESS_TOKEN_SECRET_KEY) as jwt.JwtPayload;
	} catch (error) {
		Logger.warn(`Access token verification error: ${(error as Error).message}`);
		throw error;
	}
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
	try {
		return jwt.verify(token, env.REFRESH_TOKEN_SECRET_KEY) as jwt.JwtPayload;
	} catch (error) {
		Logger.warn(`Refresh token verification error: ${(error as Error).message}`);
		throw error;
	}
};
