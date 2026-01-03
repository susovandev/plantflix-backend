import {
	CLEANUP_JOBS_SCHEDULE_PATTERN,
	CLEANUP_QUEUE_ACTION_NAME,
} from 'constants/Jobs/job.constants';
import { cleanupQueue } from './queues/cleanup.queue';
import Logger from 'lib/logger';

export const registerCleanupJob = async () => {
	Logger.info('Registering cleanup cron job');

	await cleanupQueue.upsertJobScheduler(
		CLEANUP_QUEUE_ACTION_NAME,
		{
			pattern: CLEANUP_JOBS_SCHEDULE_PATTERN,
			tz: 'Asia/Kolkata',
		},
		{
			name: CLEANUP_QUEUE_ACTION_NAME,
			data: { jobData: 'cleanup-cron-scheduler-data' },
			opts: {
				removeOnComplete: true,
				removeOnFail: 50,
				attempts: 3,
				backoff: {
					type: 'exponential',
					delay: 5000,
				},
			},
		},
	);

	Logger.info('Cleanup cron job registered successfully');
};
