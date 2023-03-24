
export interface IPitState {
	login: {
		loadStatus: 'none' | 'loading' | 'success' | 'failed';
		error: string;
		user: IUser;
	}
}

export interface IUser {
	teamNumber: string;
	username: string;
	eventCode: string;
	secretCode: string;
}
