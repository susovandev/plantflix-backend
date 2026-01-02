import 'express-serve-static-core';

export interface AuthUser {
	userId: string;
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: AuthUser;
	}
}

export {};
