import mongoose from 'mongoose';

export enum VerificationCodeStatus {
	PENDING = 'pending',
	USED = 'used',
	EXPIRED = 'expired',
}
export enum VerificationCodeType {
	ACCOUNT_ACTIVATION = 'accountActivation',
	PASSWORD_RESET = 'passwordReset',
}

export interface IVerificationCodeDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	code: string;
	verificationStatus: VerificationCodeStatus;
	type: VerificationCodeType;
	issuedAt: Date;
	expiredAt: Date;
	verifiedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<IVerificationCodeDocument>(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		code: { type: String, required: true },
		verificationStatus: {
			type: String,
			enum: Object.values(VerificationCodeStatus),
			default: VerificationCodeStatus.PENDING,
		},
		type: { type: String, enum: Object.values(VerificationCodeType) },
		issuedAt: { type: Date, default: Date.now },
		expiredAt: { type: Date, required: true },
		verifiedAt: { type: Date },
	},
	{ timestamps: true },
);

verificationCodeSchema.index({ userId: 1, code: 1, type: 1, verificationStatus: 1 });

export default mongoose.model<IVerificationCodeDocument>(
	'VerificationCode',
	verificationCodeSchema,
);
