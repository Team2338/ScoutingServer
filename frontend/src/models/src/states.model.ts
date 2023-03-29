import { Language } from './languages.model';
import {
	GlobalObjectiveStats, ImageInfo,
	Match,
	MatchResponse,
	Note,
	ObjectiveDescriptor,
	Plan,
	Team
} from './response.model';

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	loadingWithPriorSuccess = 'reloading',
	failed = 'failed',
	failedWithPriorSuccess = 'failed reload',
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
		loadStatus: LoadStatus;
		url: string;
	};
	matches: {
		loadStatus: LoadStatus;
		raw: MatchResponse[];
		data: Match[];
		selectedMatch: Match;
	};
	teams: {
		loadStatus: LoadStatus;
		data: Team[];
		selectedTeam: Team;
	};
	stats: {
		loadStatus: LoadStatus;
		data: GlobalObjectiveStats[];
		selectedStat: ObjectiveDescriptor;
	};
	notes: {
		loadStatus: LoadStatus;
		data: Note[];
	};
	planning: {
		loadStatus: LoadStatus;
		firstTeam: Team;
		secondTeam: Team;
		thirdTeam: Team;
		plan: Plan;
	};
	images: {
		[teamNumber: number]: {
			loadStatus: LoadStatus;
			info: ImageInfo;
			url: string;
		};
	};
}
