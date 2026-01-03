import winston from 'winston';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white',
};

winston.addColors(colors);

const level = () => {
	const environment = process.env['NODE_ENV'] || 'development';
	return environment === 'development' ? 'debug' : 'warn';
};

const format = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.colorize({ all: true }),
	winston.format.errors({ stack: true }),
	winston.format.splat(),
	winston.format.printf((info) => {
		const msg =
			typeof info.message === 'object' ? JSON.stringify(info.message, null, 2) : info.message;
		return `${info['timestamp']} ${info.level}: ${msg}`;
	}),
);

const transports = [
	new winston.transports.Console({ level: 'debug' }),
	new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
	new winston.transports.File({ filename: 'logs/all.log' }),
];

const Logger = winston.createLogger({
	level: level(),
	levels,
	format,
	defaultMeta: {
		service: process.env['SERVICE_NAME'],
	},
	transports,
});

export default Logger;
