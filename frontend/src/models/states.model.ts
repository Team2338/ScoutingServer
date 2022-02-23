import { GlobalObjectiveStats, Match, MatchResponse, Team } from './response.model';

export interface AppState {
	isLoggedIn: boolean;
	teamNumber: number;
	eventCode: string;
	secretCode: string;
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
		selectedStat: {
			gamemode: string;
			objective: string;
		}
	};
}
