export const EMAIL_QUEUE_NAME = 'email-queue';
export const EMAIL_QUEUE_ACTION_NAME = 'send-email';
export const EMAIL_JOB_RETRY_COUNT = 3;
export const EMAIL_JOB_DELAY = 5000;
export const EMAIL_JOB_CONCURRENCY = 5;

export const CLEANUP_QUEUE_NAME = 'cleanup-queue';
export const CLEANUP_QUEUE_ACTION_NAME = 'weekly-cleanup-cron-scheduler';

export const CLEANUP_JOBS_SCHEDULE_PATTERN = '0 0 * * 0'; // Every Sunday at midnight

export const OLD_DATA_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
