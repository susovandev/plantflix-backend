import { Request } from 'express';

export interface IRegisterBody extends Request {
	name: string;
	email: string;
	password: string;
}

export interface IVerifyOtpBody extends Request {
	email: string;
	code: string;
}

export interface IResendOtpBody extends Request {
	email: string;
}
