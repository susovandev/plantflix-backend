import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from 'lib/response';

export const healthCheckHandler = (_req: Request, res: Response) => {
	const response = {
		uptime: process.uptime(),
		memoryUsage: process.memoryUsage(),
		memoryRss: process.memoryUsage().rss,
		timestamp: Date.now(),
	};

	return res
		.status(StatusCodes.OK)
		.json(new ApiResponse(StatusCodes.OK, 'Server is up and running', response));
};
