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

export interface Comment {
	id: number;
	robotNumber: number;
	matchNumber: number;
	topic: string;
	content: string;
	creator: string;
	timeCreated: string;
}

export interface CommentsForRobot {
	[topic: string]: Comment[];
}

export interface CommentsForEvent {
	[robotNumber: number]: CommentsForRobot;
}
