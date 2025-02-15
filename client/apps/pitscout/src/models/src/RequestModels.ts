
export interface ICreateInspectionRequest {
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	questions: IInspectionQuestion[];
}

export interface IInspectionQuestion {
	question: string;
	answer: string;
	creator: string;
}
