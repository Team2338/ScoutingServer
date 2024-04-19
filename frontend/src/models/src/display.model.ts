import { ReactElement } from 'react';

export interface GridScoreConfig {
	[value: number]: {
		background: string;
		color?: string;
		innerContent?: ReactElement;
	};
}

export interface Inspection {
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	questions: InspectionQuestion[];
}

export interface InspectionQuestion {
	id: number;
	question: string;
	answer: string;
	creator: string;
	timeCreated: string;
}

export interface ImageInfo {
	robotNumber: number;
	url: string;
	creator: string;
	timeCreated: string;
}
