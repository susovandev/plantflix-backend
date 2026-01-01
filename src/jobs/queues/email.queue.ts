import { Queue } from 'bullmq';
import { redisConnection } from 'config/redis.config';

export interface ISendEmailJob {
	emailId: string;
}

export const EMAIL_QUEUE_NAME = 'email-queue';

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
	connection: redisConnection,
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: 'exponential',
			delay: 5000,
		},
		removeOnComplete: true,
		removeOnFail: false,
	},
});
