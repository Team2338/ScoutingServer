import { Language } from './languages.model';
import {
	GlobalObjectiveStats,
	Match,
	MatchResponse,
	Note,
	ObjectiveDescriptor, Plan,
	Team
} from './response.model';

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	failed = 'failed',
	success = 'success',
}

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
	planning: {
		loadStatus: LoadStatus;
		firstTeam: Team;
		secondTeam: Team;
		thirdTeam: Team;
		plan: Plan;
	}
}
