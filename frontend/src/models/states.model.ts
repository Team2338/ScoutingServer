import { Match } from './response.model';

export interface AppState {
	teamNumber: number;
	eventCode: string;
	secretCode: string;
	matches: {
		isLoaded: boolean;
		data: Match[];
		selectedMatch: Match;
	};
}

