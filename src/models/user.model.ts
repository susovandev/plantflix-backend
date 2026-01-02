import mongoose from 'mongoose';

export enum UserRole {
	USER = 'user',
	NURSERY_ADMIN = 'nursery_admin',
	SUPER_ADMIN = 'super_admin',
}

export enum AccountStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	SUSPENDED = 'suspended',
	PENDING = 'pending',
}
export interface IUserDocument extends mongoose.Document {
	name: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	nurseryId?: mongoose.Types.ObjectId;
	avatarUrl?: string;
	location?: { lat: number; lng: number; zone?: string };
	accountVerified?: boolean;
	accountStatus?: AccountStatus;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		passwordHash: { type: String, required: true },
		role: {
			type: String,
			enum: Object.values(UserRole),
			default: UserRole.USER,
		},
		nurseryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nursery' },
		avatarUrl: { type: String, match: /^https?:\/\// },
		location: {
			lat: { type: Number },
			lng: { type: Number },
			zone: { type: String },
		},
		accountVerified: { type: Boolean, default: false },
		accountStatus: {
			type: String,
			enum: Object.values(AccountStatus),
			default: AccountStatus.PENDING,
		},
	},
	{ timestamps: true },
);

userSchema.index({ nurseryId: 1 });

export default mongoose.model<IUserDocument>('User', userSchema);
