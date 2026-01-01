import { z } from 'zod';

export const registerSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }).max(255),
	email: z.string().email(),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255),
});

export type TRegisterDTO = z.infer<typeof registerSchema>;
