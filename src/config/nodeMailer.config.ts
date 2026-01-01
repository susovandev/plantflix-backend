import nodemailer, { type Transporter } from 'nodemailer';
import { env } from './env.config';

const transporter: Transporter = nodemailer.createTransport({
	service: env.MAIL_SERVICE,
	host: env.MAIL_HOST,
	port: env.MAIL_PORT,
	auth: {
		user: env.MAIL_USER,
		pass: env.MAIL_PASSWORD,
	},
});

export default transporter;
