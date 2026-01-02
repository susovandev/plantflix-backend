import mongoose from 'mongoose';

export interface IRefreshTokenDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	token: string;
	expiredAt: Date;
	isRevoked?: boolean;
	userAgent?: string;
	ipAddress?: string;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshTokenDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	token: { type: String, required: true },
	expiredAt: { type: Date, required: true },
	isRevoked: { type: Boolean, default: false },
	userAgent: { type: String },
	ipAddress: { type: String },
});

export default mongoose.model<IRefreshTokenDocument>('RefreshToken', refreshTokenSchema);
