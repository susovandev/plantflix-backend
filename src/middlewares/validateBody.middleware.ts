import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from 'lib/logger';

/**
 * Middleware to validate request body is not empty
 * @param req
 * @param res
 * @param next
 * @returns
 */

export const validateEmptyBody = (
	req: Request,
	res: Response,
	next: NextFunction,
): Response | void => {
	if (req.body === undefined || Object.keys(req.body).length === 0) {
		Logger.warn(`Request blocked: empty request body - ${JSON.stringify(req.body)}`);
		return res.status(StatusCodes.BAD_REQUEST).json({
			status: false,
			statusCode: StatusCodes.BAD_REQUEST,
			message: 'Empty request body is not allowed for this endpoint.',
		});
	}
	next();
};
