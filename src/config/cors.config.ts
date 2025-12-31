import cors, { CorsOptions } from 'cors';
import { env } from './env.config';

const corsOptions: CorsOptions = {
	origin: (origin, cb) => {
		const allowedOrigins = [env.CLIENT_DEVELOPMENT_URL, env.CLIENT_PRODUCTION_URL];
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			cb(null, true);
		} else {
			cb(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Accept-version'],
	exposedHeaders: ['X-Total-Count', 'Content-Range'],
	credentials: true,
	preflightContinue: false,
	maxAge: 600,
	optionsSuccessStatus: 204,
};

export const corsConfig = cors(corsOptions);
