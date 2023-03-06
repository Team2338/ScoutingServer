import { Language } from './languages.model';
import { GlobalObjectiveStats, Match, MatchResponse, Note, ObjectiveDescriptor, Team } from './response.model';

export enum RequestStatus {
	none = 'none',
	loading = 'loading',
	loadingWithPriorSuccess = 'reloading',
	failed = 'failed',
	failedWithPriorSuccess = 'failed reload',
	success = 'success'
}

export interface AppState {
	language: Language;
	isLoggedIn: boolean;
	teamNumber: number;
	username: string;
	eventCode: string;
	secretCode: string;
	csv: {
		loadStatus: RequestStatus;
		url: string;
	};
	matches: {
		loadStatus: RequestStatus;
		raw: MatchResponse[];
		data: Match[];
		selectedMatch: Match;
	};
	teams: {
		loadStatus: RequestStatus;
		data: Team[];
		selectedTeam: Team;
	};
	stats: {
		loadStatus: RequestStatus;
		data: GlobalObjectiveStats[];
		selectedStat: ObjectiveDescriptor;
	};
	notes: {
		loadStatus: RequestStatus;
		data: Note[];
	};
}
