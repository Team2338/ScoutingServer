
export interface IPitState {
	login: {
		loadStatus: LoadStatus;
		error: string;
		user: IUser;
		token: IToken;
	},
	upload: {
		loadStatus: LoadStatus;
	}
}

export interface IUser {
	teamNumber: string;
	username: string;
	eventCode: string;
	secretCode: string;
}

export interface IToken {
	teamNumber: number;
	username: string;
	role: UserRoles;
}

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	success = 'success',
	failed = 'failed'
}

export enum UserRoles {
	admin = 'admin',
	none = 'none'
}
