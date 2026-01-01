import './jobs/workers/email.worker';
import initializeApp from 'app';
import { env } from 'config/env.config';
import connectDB, { disconnectDB } from 'db/db';
import Logger from 'lib/logger';
import { Server } from 'http';

let server: Server;
let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
	if (isShuttingDown) return;
	isShuttingDown = true;

	Logger.warn(`Received ${signal}. Starting graceful shutdown...`);

	const forceExitTimer = setTimeout(() => {
		Logger.error('Graceful shutdown timed out. Forcing exit...');
		process.exit(1);
	}, 10000);

	try {
		if (server) {
			await new Promise<void>((resolve) => {
				server.close(() => {
					Logger.info('HTTP server closed');
					resolve();
				});
			});
		}

		await disconnectDB();
		Logger.info('Database disconnected');

		clearTimeout(forceExitTimer);
		Logger.info('Graceful shutdown completed');
		process.exit(0);
	} catch (error) {
		Logger.error('Error during shutdown', error as Error);
		process.exit(1);
	}
}

export default async function bootstrapApp() {
	const app = initializeApp();

	try {
		await connectDB();

		server = app.listen(env.PORT, () => {
			Logger.info(
				`${env.SERVICE_NAME} is running at http://localhost:${env.PORT} in ${env.NODE_ENV} mode`,
			);
			Logger.info(`Health check at http://localhost:${env.PORT}/health`);
		});

		// Optional hardening
		server.keepAliveTimeout = 65000;
		server.headersTimeout = 66000;
	} catch (error) {
		Logger.error(`Startup error: ${(error as Error).message}`);
		await gracefulShutdown('STARTUP_FAILURE');
	}
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('uncaughtException', async (error) => {
	Logger.error('Uncaught Exception', error);
	await gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', async (reason) => {
	Logger.error('Unhandled Rejection', reason as Error);
	await gracefulShutdown('UNHANDLED_REJECTION');
});

bootstrapApp();
