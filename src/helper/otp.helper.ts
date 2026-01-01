import crypto from 'node:crypto';

export default function getRandomOTP(): string {
	return crypto.randomInt(100000, 999999).toString();
}
