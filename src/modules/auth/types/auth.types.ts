import { Request } from 'express';

export interface IRegisterBody extends Request {
	name: string;
	email: string;
	password: string;
}
