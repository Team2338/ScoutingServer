import { UserRole } from './auth.model';

export interface IEventInfo {
	teamNumber: number;
	gameYear: number;
	eventCode: string;
	secretCode: string;
	matchCount: number | null;
	inspectionCount: number | null;
}

export interface IUserInfo {
	id: number;
	email: string;
	teamNumber: number;
	username: string;
	role: UserRole;
}

export interface ILoginResponse {
	token: string;
	user: IUserInfo;
}

export interface IInspectionQuestionResponse {
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