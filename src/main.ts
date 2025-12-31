import initializeApp from 'app';
import { env } from 'config/env.config';
import Logger from 'lib/logger';

export default function bootstrapApp() {
	const app = initializeApp();

	app.listen(env.PORT, () => {
		Logger.info(
			`${env.SERVICE_NAME} is running at http://localhost:${env.PORT} in ${env.NODE_ENV} mode`,
		);
		Logger.info(`Health check at http://localhost:${env.PORT}/health`);
	});
}

bootstrapApp();
