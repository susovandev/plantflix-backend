import IORedis from 'ioredis';
import { env } from 'config/env.config';

export const redisConnection = new IORedis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	password: env.REDIS_PASSWORD,
	maxRetriesPerRequest: null, // REQUIRED for BullMQ
});
