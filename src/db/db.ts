import Logger from 'lib/logger';
import mongoose from 'mongoose';
import { env } from 'config/env.config';

export default async function connectDB() {
	try {
		const connectionInstance = await mongoose.connect(`${env.DATABASE_URI}/${env.DATABASE_NAME}`);
		Logger.info(`Database connected: ${connectionInstance.connection.host}`);
	} catch (error) {
		Logger.error(`Database connection error: ${(error as Error).message}`);
		throw error;
	}
}

export async function disconnectDB() {
	try {
		await mongoose.connection.close();
		Logger.info('Database disconnected');
	} catch (error) {
		Logger.error(`Database disconnection error: ${(error as Error).message}`);
		throw error;
	}
}
