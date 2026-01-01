import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	PORT: z.coerce.number().default(3000),
	SERVICE_NAME: z.string(),

	APP_NAME: z.string(),
	LOGIN_URL: z.string(),
	SUPPORT_EMAIL: z.string(),

	CLIENT_DEVELOPMENT_URL: z.string(),
	CLIENT_PRODUCTION_URL: z.string(),

	DATABASE_URI: z.string(),
	DATABASE_NAME: z.string(),

	MAIL_SERVICE: z.string(),
	MAIL_HOST: z.string(),
	MAIL_PORT: z.coerce.number(),
	MAIL_USER: z.string(),
	MAIL_PASSWORD: z.string(),

	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number(),
	REDIS_PASSWORD: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error('Invalid environment variables');
	process.exit(1);
}

export const env = _env.data;
