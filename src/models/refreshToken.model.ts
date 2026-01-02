import mongoose from 'mongoose';

export interface IRefreshTokenDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	tokenHash: string;
	expiredAt: Date;
	removedAt?: Date;
	deviceInfo?: string;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshTokenDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	tokenHash: { type: String, required: true },
	expiredAt: { type: Date, required: true },
	removedAt: { type: Date },
	deviceInfo: { type: String },
});

export default mongoose.model<IRefreshTokenDocument>('RefreshToken', refreshTokenSchema);
