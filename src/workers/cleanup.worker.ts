import { Worker } from 'bullmq';
import { redisConnection } from 'config/redis.config';
import Logger from 'lib/logger';
import emailModel, { EmailStatus } from 'models/email.model';
import verificationCodeModel, { VerificationCodeStatus } from 'models/verificationCode.model';
import { CLEANUP_QUEUE_NAME, OLD_DATA_THRESHOLD_MS } from 'constants/Jobs/job.constants';

export const cleanupWorker = new Worker(
	CLEANUP_QUEUE_NAME,
	async (job) => {
		Logger.info('Cleanup job started');
		Logger.info(`Processing job ${job.id} at ${new Date()} with data: ${job.data.jobData}`);

		const thresholdDate = new Date(Date.now() - OLD_DATA_THRESHOLD_MS);

		const [verificationResult, emailResult] = await Promise.all([
			verificationCodeModel.deleteMany({
				verificationStatus: {
					$in: [VerificationCodeStatus.EXPIRED, VerificationCodeStatus.USED],
				},
				expiredAt: { $lt: thresholdDate },
			}),
			emailModel.deleteMany({
				status: {
					$in: [EmailStatus.SENT, EmailStatus.FAILED],
				},
				createdAt: { $lt: thresholdDate },
			}),
		]);

		Logger.info(`Deleted ${verificationResult.deletedCount} verification codes`);
		Logger.info(`Deleted ${emailResult.deletedCount} emails`);

		Logger.info('Cleanup job completed');
	},
	{
		connection: redisConnection,
		concurrency: 1,
	},
);
