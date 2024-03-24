import { ReactElement } from 'react';

export interface GridScoreConfig {
	[value: number]: {
		background: string;
		color?: string;
		innerContent?: ReactElement;
	};
}

export const STAT_GRAPH_COLORS: string[] = [
	'#254999',
	'#dd8850',
	'#884099',
	'#44ac88'
];

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

export interface ImageInfo {
	robotNumber: number;
	url: string;
	creator: string;
	timeCreated: string;
}
