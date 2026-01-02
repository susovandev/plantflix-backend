import { z } from 'zod';

export const registerValidationSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }).max(255),
	email: z.string().email(),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255),
});

export type TRegisterDTO = z.infer<typeof registerValidationSchema>;

export const verifyOTPValidationSchema = z.object({
	email: z.string().email(),
	code: z.string().regex(/^\d{6}$/, { message: 'Code must be a 6-digit numeric string' }),
});

export type TVerifyOtpDTO = z.infer<typeof verifyOTPValidationSchema>;

export const resendOTPValidationSchema = z.object({ email: z.string().email() });

export type TResendOtpDTO = z.infer<typeof resendOTPValidationSchema>;

export const loginValidationSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255),
});

export type TLoginDTO = z.infer<typeof loginValidationSchema>;
