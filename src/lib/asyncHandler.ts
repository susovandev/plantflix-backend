import type { Request, Response, NextFunction } from 'express';
export const asyncHandler =
	(
		fn: (
			req: Request,
			res: Response,
			next: NextFunction,
		) => Promise<Response<unknown, Record<string, unknown>>>,
	) =>
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
