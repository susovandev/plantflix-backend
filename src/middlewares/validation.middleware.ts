import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { BadRequestError } from 'lib/errors';
import { StatusCodes } from 'http-status-codes';
import Logger from 'lib/logger';

/**
 * Middleware to validate request data
 * @param schema
 * @param location - 'body', 'params', 'query'
 * @returns {Function}
 */
type TLocation = 'body' | 'params' | 'query';
export const validateRequest = (schema: z.ZodType, location: TLocation = 'body') => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[location]);

		if (!result.success) {
			Logger.warn(`Invalid request data - ${JSON.stringify(result.error.issues[0]?.path)}`);

			const badRequestError = new BadRequestError('Invalid request data', {
				path: result.error.issues[0]?.path,
				message: result.error.issues[0]?.message,
			});

			return res.status(StatusCodes.BAD_REQUEST).json(badRequestError);
		}

		// Optional: replace req data with parsed & sanitized data
		req[location] = result.data;

		return next();
	};
};
