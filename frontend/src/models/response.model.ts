
export interface Match {
	id: number;
	teamNumber: number;
	eventCode: string;
	matchNumber: number;
	robotNumber: number;
	creator: string;
	timeCreated: string;
	objectives: Objective[];
}

export interface Objective {
	id: number;
	gamemode: string;
	objective: string;
	count: number;
}
