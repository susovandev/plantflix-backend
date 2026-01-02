import mongoose from 'mongoose';

enum LoginAttempt {
	SUCCESS = 'success',
	FAILED = 'failed',
}
export interface ILoginHistoryDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	ipAddress: string;
	userAgent: string;
	attempt: LoginAttempt;
	loginAt: Date;
}

const loginHistorySchema = new mongoose.Schema<ILoginHistoryDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	ipAddress: { type: String, required: true },
	userAgent: { type: String, required: true },
	attempt: { type: String, enum: Object.values(LoginAttempt), required: true },
	loginAt: { type: Date, required: true },
});

export default mongoose.model<ILoginHistoryDocument>('LoginHistory', loginHistorySchema);
