
export interface IUserInfo {
	id: number;
	email: string;
	teamNumber: number;
	username: string;
	role: string;
}

export interface IEventInfo {
	teamNumber: number;
	gameYear: number;
	eventCode: string;
	secretCode: string;
	matchCount?: number;
	inspectionCount: number;
}

export interface ILoginResponse {
	token: string;
	user: IUserInfo;
}

export interface IDetailNoteQuestionResponse {
	id: number;
	teamNumber: number;
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	secretCode: string;
	question: string;
	answer: string;
	creator: string;
	timeCreated: string;
}
