import { IEventInfo } from '@gearscout/models';

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

export interface IOfflineCreateInspectionRequest {
	inspection: ICreateInspectionRequest;
	event: IEventInfo;
}
