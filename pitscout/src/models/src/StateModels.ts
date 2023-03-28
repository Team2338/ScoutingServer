
export interface IPitState {
	login: {
		loadStatus: LoadStatus;
		error: string;
		user: IUser;
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

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	success = 'success',
	failed = 'failed'
}
