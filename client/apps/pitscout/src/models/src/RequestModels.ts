
export interface ICreateDetailNoteRequest {
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	questions: IDetailNoteQuestion[];
}

export interface IDetailNoteQuestion {
	question: string;
	answer: string;
	creator: string;
}
