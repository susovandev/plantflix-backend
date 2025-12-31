import mongoose from 'mongoose';

interface IUserDocument extends mongoose.Document {
	name: string;
	email: string;
	passwordHash: string;
	role: 'user' | 'nursery_admin' | 'super_admin';
	nurseryId?: mongoose.Types.ObjectId;
	avatarUrl?: string;
	location?: { lat: number; lng: number; zone?: string };
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
			enum: ['user', 'nursery_admin', 'super_admin'],
			default: 'user',
		},
		nurseryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nursery' },
		avatarUrl: { type: String, match: /^https?:\/\// },
		location: {
			lat: { type: Number },
			lng: { type: Number },
			zone: { type: String },
		},
	},
	{ timestamps: true },
);

export default mongoose.model<IUserDocument>('User', userSchema);
