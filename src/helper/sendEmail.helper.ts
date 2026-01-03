import transporter from 'config/nodeMailer.config';
import { env } from 'config/env.config';
import Logger from 'lib/logger';

export interface IEmailTemplate {
	sender?: string;
	recipient: string;
	subject: string;
	htmlTemplate: string;
}

export async function sendEmailService(emailData: IEmailTemplate): Promise<void> {
	try {
		const { sender, recipient, subject, htmlTemplate } = emailData;
		await transporter.sendMail({
			from: sender || env.MAIL_USER,
			to: recipient,
			subject: subject,
			html: htmlTemplate,
		});
		Logger.info('Email sent successfully');
	} catch (error) {
		Logger.error(`Email sending error: ${(error as Error).message}`);
		throw error;
	}
}
