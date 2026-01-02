import { API_PREFIX } from 'constants/app/app.constants';
import { Application } from 'express';
import authRouter from 'modules/auth/routes/auth.routes';
import { healthCheckHandler } from 'modules/health/healthCheck.controller';
export default function configureRoutes(app: Application) {
	app.use('/health', healthCheckHandler);
	app.use(`${API_PREFIX}/auth`, authRouter);
}
