export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

export const BCRYPT_SALT_ROUNDS = 10;

export const VERIFICATION_CODE_EXPIRATION_TIME = 3 * 60 * 1000; // 3 minutes

export const EMAIL_QUEUE_NAME = 'email-queue';
export const EMAIL_JOB_RETRY_COUNT = 3;
export const EMAIL_JOB_DELAY = 5000;
export const EMAIL_JOB_CONCURRENCY = 5;
