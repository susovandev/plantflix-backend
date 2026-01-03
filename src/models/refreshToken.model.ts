import mongoose from 'mongoose';

export interface IRefreshTokenDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	token: string;
	expiredAt: Date;
	isRevoked?: boolean;
	userAgent?: string;
	ipAddress?: string;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshTokenDocument>(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		token: { type: String, required: true },
		expiredAt: { type: Date, required: true },
		isRevoked: { type: Boolean, default: false },
		userAgent: { type: String },
		ipAddress: { type: String },
	},
	{ timestamps: true },
);

refreshTokenSchema.index({ userId: 1, token: 1 });
refreshTokenSchema.index({ expiredAt: 1 });

export default mongoose.model<IRefreshTokenDocument>('RefreshToken', refreshTokenSchema);
