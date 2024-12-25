export interface IEventInfo {
	teamNumber: number;
	gameYear: number;
	eventCode: string;
	secretCode: string;
	matchCount?: number;
	inspectionCount: number;
}

export interface IUserInfo {
	id: number;
	email: string;
	teamNumber: number;
	username: string;
	role: string;
}

export interface ILoginResponse {
	token: string;
	user: IUserInfo;
}
