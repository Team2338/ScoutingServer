
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
	sumList: number[]; // The sum of all lists
	meanList: number[]; // The average of all lists
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

export interface Plan {
	teams: Team[];
	gamemodes: {
		[gamemode: string]: {
			name: string;
			objectives: {
				[objective: string]: {
					name: string;
					stats: TeamObjectiveStats[];
				};
			};
		};
	};
}

export interface ImageInfo {
	id: number;
	present: boolean;
	teamNumber: number;
	gameYear: number;
	robotNumber: number;
	creator: string;
	imageId: number;
	timeCreated: string;
}

export interface InspectionQuestionResponse {
	id: number;
	teamNumber: number;
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	secretCode: string;
	question: string;
	answer: string;
	creator: string;
	timeCreated: string;
}

export interface CommentResponse {
	id: number;
	teamNumber: number;
	robotNumber: number;
	gameYear: number;
	eventCode: string;
	secretCode: string;
	matchNumber: number;
	topic: string;
	content: string;
	creator: string;
	timeCreated: string;
}
