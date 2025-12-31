import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	PORT: z.coerce.number().default(3000),
	SERVICE_NAME: z.string(),

	CLIENT_DEVELOPMENT_URL: z.string(),
	CLIENT_PRODUCTION_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error('Invalid environment variables');
	process.exit(1);
}

export const env = _env.data;
