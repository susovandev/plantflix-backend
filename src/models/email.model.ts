import mongoose from 'mongoose';

export enum EmailSource {
	USER = 'user',
	NURSERY_ADMIN = 'nursery_admin',
	SUPER_ADMIN = 'super_admin',
	SYSTEM = 'system',
}

export enum EmailStatus {
	SENT = 'sent',
	FAILED = 'failed',
	PENDING = 'pending',
}

interface IEmailDocument extends mongoose.Document {
	sender: mongoose.Types.ObjectId;
	recipient: mongoose.Types.ObjectId;
	recipientEmail: string;
	subject: string;
	body: string;
	source: EmailSource;
	sendAt: Date;
	status: EmailStatus;
	retryCount: number;
	lastError: string;
	createdAt: Date;
	updatedAt: Date;
}

const emailSchema = new mongoose.Schema<IEmailDocument>(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		recipientEmail: { type: String, required: true },
		subject: { type: String, required: true },
		body: { type: String, required: true },
		source: { type: String, enum: Object.values(EmailSource), required: true },
		sendAt: { type: Date, default: Date.now },
		status: { type: String, enum: Object.values(EmailStatus) },
		retryCount: { type: Number, default: 0 },
		lastError: { type: String },
	},
	{ timestamps: true },
);

emailSchema.index({ recipient: 1, status: 1 });
emailSchema.index({ sendAt: 1, status: 1 });

export default mongoose.model<IEmailDocument>('Email', emailSchema);
