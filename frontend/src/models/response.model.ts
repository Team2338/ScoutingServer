
export interface MatchResponse {
	id: number;
	teamNumber: number;
	eventCode: string;
	matchNumber: number;
	robotNumber: number;
	creator: string;
	timeCreated: string;
	isHidden: boolean;
	objectives: Objective[];
}

export interface Objective {
	id: number;
	gamemode: string;
	objective: string;
	count: number;
}

export interface Match {
	id: number;
	teamNumber: number;
	eventCode: string;
	matchNumber: number;
	robotNumber: number;
	creator: string;
	timeCreated: string;
	isHidden: boolean;
	gamemodes: Map<string, Objective[]>;
}

export type ObjectiveStats = Map<string, Map<string, TeamObjectiveStats>>; // gamemode -> objective -> stats

export interface Team {
	id: number;
	stats: ObjectiveStats;
}

export interface TeamObjectiveStats {
	scores: number[];
	mean: number;
	variance: number;
	median: number;
	mode: number;
}

export interface GlobalObjectiveStats {
	name: string;
	gamemode: string;
	scores: Map<number, number>; // teamNumber -> avg count for that team
	stats: {
		mean: number;
		median: number;
	}
}
