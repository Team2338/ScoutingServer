
export interface ICreateDetailNoteRequest {
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	question: IDetailNoteQuestion[];
}

export interface IDetailNoteQuestion {
	question: string;
	answer: string;
	creator: string;
}
