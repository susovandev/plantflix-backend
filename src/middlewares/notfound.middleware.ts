import type { Request, Response, NextFunction } from 'express';
import { NotFoundError } from 'lib/errors';
import Logger from 'lib/logger';
export const notFoundHandler = (req: Request, _res: Response, _next: NextFunction) => {
	Logger.warn(`Route Not Found - ${req.originalUrl}`);
	_next(new NotFoundError(`Route Not Found - ${req.originalUrl}`));
};
