import { Queue } from 'bullmq';
import { redisConnection } from 'config/redis.config';
import { CLEANUP_QUEUE_NAME } from 'constants/Jobs/job.constants';

export const cleanupQueue = new Queue(CLEANUP_QUEUE_NAME, {
	connection: redisConnection,
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: 50,
		attempts: 3,
		backoff: {
			type: 'exponential',
			delay: 5000,
		},
	},
});
