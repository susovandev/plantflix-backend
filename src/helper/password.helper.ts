import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../constants';

export async function hashPassword(password: string): Promise<string> {
	const genSalt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
	return await bcrypt.hash(password, genSalt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}
