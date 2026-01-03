import { IUserDocument, UserRole } from 'models/user.model';

export interface IUserProfileResponseDTO {
	userId: string;
	name: string;
	email: string;
	role: UserRole;
	avatarUrl: string | undefined;
	location:
		| {
				lat: number;
				lng: number;
				zone?: string;
		  }
		| undefined;
	accountVerified: boolean;
	createdAt: string;
}

export const sanitizeUserProfileResponse = (user: IUserDocument): IUserProfileResponseDTO => {
	return {
		userId: user._id.toString(),
		name: user.name,
		email: user.email,
		role: user.role,
		avatarUrl: user.avatarUrl ?? undefined,
		location: user.location ?? undefined,
		accountVerified: Boolean(user.accountVerified),
		createdAt: user.createdAt.toISOString(),
	};
};
