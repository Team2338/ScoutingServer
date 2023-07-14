import { ReactElement } from 'react';

export interface GridScoreConfig {
	[value: number]: {
		background: string;
		color?: string;
		innerContent?: ReactElement;
	};
}

export interface DetailNote {
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	questions: DetailNoteQuestion[];
}

export interface DetailNoteQuestion {
	id: number;
	question: string;
	answer: string;
	creator: string;
	timeCreated: string;
}
