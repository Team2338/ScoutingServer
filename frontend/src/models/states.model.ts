import { Match } from './response.model';

export interface AppState {
	isLoggedIn: boolean;
	teamNumber: number;
	eventCode: string;
	secretCode: string;
	matches: {
		isLoaded: boolean;
		data: Match[];
		selectedMatch: Match;
	};
}

