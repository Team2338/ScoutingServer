import { Language } from './languages.model';
import { GlobalObjectiveStats, Match, MatchResponse, Note, ObjectiveDescriptor, Team } from './response.model';

export interface AppState {
	language: Language;
	isLoggedIn: boolean;
	teamNumber: number;
	username: string;
	eventCode: string;
	secretCode: string;
	csv: {
		isLoaded: boolean;
		url: string;
	};
	matches: {
		isLoaded: boolean;
		raw: MatchResponse[];
		data: Match[];
		selectedMatch: Match;
	};
	teams: {
		isLoaded: boolean;
		data: Team[];
		selectedTeam: Team;
	};
	stats: {
		isLoaded: boolean;
		data: GlobalObjectiveStats[];
		selectedStat: ObjectiveDescriptor;
	};
	notes: {
		isLoaded: boolean;
		data: Note[];
	};
}
