import { healthCheckHandler } from 'controllers/health-check/healthCheck.controller';
import { Application } from 'express';
export default function configureRoutes(app: Application) {
	app.use('/health', healthCheckHandler);
}
