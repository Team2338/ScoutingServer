
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
	count?: number;
	list?: number[];
}

export interface ObjectiveDescriptor {
	gamemode: string;
	objective: string;
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
	teamNumber: number;
	scores: number[];
	lists: number[][];
	meanList: number[];
	mean: number;
	variance: number;
	median: number;
	mode: number;
}

export interface GlobalObjectiveStats {
	name: string;
	gamemode: string;
	scores: {
		teamNumber: number;
		mean: number;
	}[];
	stats: {
		mean: number;
		median: number;
	}
}

export interface NewNote {
	eventCode: string;
	robotNumber: number;
	creator: string;
	content: string;
}

export interface Note {
	id: number;
	teamNumber: number;
	secretCode: string;
	eventCode: string;
	robotNumber: number;
	creator: string;
	content: string;
	timeCreated: string;
}
