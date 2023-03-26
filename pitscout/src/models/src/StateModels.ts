
export interface IPitState {
	login: {
		loadStatus: 'none' | 'loading' | 'success' | 'failed';
		error: string;
		user: IUser;
	},
	upload: {
		loadStatus: 'none' | 'loading' | 'success' | 'failed';
	}
}

export interface IUser {
	teamNumber: string;
	username: string;
	eventCode: string;
	secretCode: string;
}
