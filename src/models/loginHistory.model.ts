import mongoose from 'mongoose';

export enum LoginAttemptStatus {
	SUCCESS = 'success',
	FAILED = 'failed',
}
export interface ILoginHistoryDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	ipAddress: string;
	userAgent: string;
	attemptStatus: LoginAttemptStatus;
	lastAttemptAt: Date;
	loginAt?: Date;
}

const loginHistorySchema = new mongoose.Schema<ILoginHistoryDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	ipAddress: { type: String, required: true },
	userAgent: { type: String, required: true },
	attemptStatus: { type: String, enum: Object.values(LoginAttemptStatus), required: true },
	lastAttemptAt: { type: Date },
	loginAt: { type: Date },
});

export default mongoose.model<ILoginHistoryDocument>('LoginHistory', loginHistorySchema);
