import { StatusCodes } from 'http-status-codes';
export class HttpError extends Error {
	status: boolean;
	details?: unknown;
	constructor(
		public statusCode: number,
		message: string,
		details?: unknown,
	) {
		super(message);
		this.status = false;
		this.statusCode = statusCode;
		this.details = details;
	}
}

export class BadRequestError extends HttpError {
	constructor(message: string = 'Bad Request', details?: unknown) {
		super(StatusCodes.BAD_REQUEST, message, details);
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message: string = 'Unauthorized') {
		super(StatusCodes.UNAUTHORIZED, message);
	}
}

export class ForbiddenError extends HttpError {
	constructor(message: string = 'Forbidden') {
		super(StatusCodes.FORBIDDEN, message);
	}
}
export class NotFoundError extends HttpError {
	constructor(message: string = 'Not Found') {
		super(StatusCodes.NOT_FOUND, message);
	}
}

export class ConflictError extends HttpError {
	constructor(message: string = 'Conflict') {
		super(StatusCodes.CONFLICT, message);
	}
}

export class TooManyRequestsError extends HttpError {
	constructor(message: string = 'Too Many Requests') {
		super(StatusCodes.TOO_MANY_REQUESTS, message);
	}
}

export class InternalServerError extends HttpError {
	constructor(message: string = 'Internal Server Error') {
		super(StatusCodes.INTERNAL_SERVER_ERROR, message);
	}
}

export class ServiceUnavailableError extends HttpError {
	constructor(message: string = 'Service Unavailable') {
		super(StatusCodes.SERVICE_UNAVAILABLE, message);
	}
}
