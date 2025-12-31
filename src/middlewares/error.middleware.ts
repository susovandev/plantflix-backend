/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from 'lib/errors';
import { StatusCodes } from 'http-status-codes';
import Logger from 'lib/logger';
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
	let status: boolean = false;
	let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
	let message: string = err.message || 'Internal Server Error';
	let details: unknown = undefined;

	if (err instanceof HttpError) {
		statusCode = err.statusCode;
		message = err.message;
		details = err.details;
		status = err.status;
	} else if (err instanceof ZodError) {
		statusCode = StatusCodes.BAD_REQUEST;
		message = 'Invalid Request Data';
		details = err.issues.map((issue) => {
			return {
				path: issue.path,
				message: issue.message,
			};
		});
	}

	Logger.error(`${req.method} - ${req.originalUrl} - ${statusCode} - ${message}`);

	res.status(statusCode).json({
		error: {
			status,
			statusCode,
			message,
			details,
		},
	});
};
