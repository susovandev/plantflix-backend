import { Queue } from 'bullmq';
import { redisConnection } from 'config/redis.config';
import { EMAIL_JOB_DELAY, EMAIL_JOB_RETRY_COUNT, EMAIL_QUEUE_NAME } from '../../constants';

export interface ISendEmailJob {
	emailId: string;
}

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
	connection: redisConnection,
	defaultJobOptions: {
		attempts: EMAIL_JOB_RETRY_COUNT, // Number of times to retry the job
		backoff: {
			type: 'exponential',
			delay: EMAIL_JOB_DELAY, // Initial delay in milliseconds
		},
		removeOnComplete: true,
		removeOnFail: false,
	},
});
