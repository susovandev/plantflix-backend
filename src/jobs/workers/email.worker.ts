import { Worker, Job } from 'bullmq';
import { redisConnection } from 'config/redis.config';
import emailModel, { EmailStatus } from 'models/email.model';
import { sendEmailService } from 'helper/sendEmail.helper';
import Logger from 'lib/logger';
import { type ISendEmailJob } from '../queues/email.queue';
import { EMAIL_JOB_CONCURRENCY, EMAIL_QUEUE_NAME } from 'constants/Jobs/job.constants';

export const emailWorker = new Worker<ISendEmailJob>(
	EMAIL_QUEUE_NAME,
	async (job: Job<ISendEmailJob>) => {
		Logger.info(`Processing email job: ${job.id}`);
		const { emailId } = job.data;

		const emailDoc = await emailModel.findById(emailId);
		if (!emailDoc) {
			Logger.error(`Email document not found: ${emailId}`);
			throw new Error('Email document not found');
		}

		try {
			await sendEmailService({
				recipient: emailDoc.recipientEmail,
				subject: emailDoc.subject,
				htmlTemplate: emailDoc.body,
			});

			emailDoc.status = EmailStatus.SENT;
			emailDoc.sendAt = new Date();
			await emailDoc.save({ session: null, validateBeforeSave: false });

			Logger.info(`Email sent successfully: ${emailId}`);
		} catch (error) {
			emailDoc.status = EmailStatus.FAILED;
			emailDoc.lastError = (error as Error).message;
			emailDoc.retryCount += 1;
			await emailDoc.save();

			Logger.error(`Email sending failed: ${emailId}`, error);
			throw error; //! IMPORTANT → triggers retry
		}
	},
	{
		connection: redisConnection,
		concurrency: EMAIL_JOB_CONCURRENCY,
	},
);
