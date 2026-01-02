import { corsConfig } from 'config/cors.config';
import express, { Application } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from 'middlewares/error.middleware';
import morganMiddleware from 'middlewares/morgan.middleware';
import { notFoundHandler } from 'middlewares/notfound.middleware';
import configureRoutes from 'routes';

export default function initializeApp(): Application {
	const app: Application = express();

	// Morgan middleware
	app.use(morganMiddleware);

	// Helmet middleware
	app.use(helmet());

	// Trust proxy
	app.set('trust proxy', true);

	// CORS middleware
	app.use(corsConfig);

	// Body-parser middlewares
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Cookie-parser middleware
	app.use(cookieParser());

	// Routes
	configureRoutes(app);

	// Not found middleware
	app.use(notFoundHandler);

	// Error middleware
	app.use(errorHandler);

	return app;
}
