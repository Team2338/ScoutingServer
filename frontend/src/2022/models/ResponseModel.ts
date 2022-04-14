
interface BaseMatchResponse {
	id: number;
	teamNumber: number;
	eventCode: string;
	matchNumber: number;
	robotNumber: number;
	creator: string;
	timeCreated: string;
	isHidden: boolean;
}

export interface Match22 extends BaseMatchResponse {
	taxi: number;
	autoHighGoals: number;
	autoLowGoals: number;
	autoMiss: number;
	teleopHighGoals: number;
	teleopLowGoals: number;
	teleopMiss: number;
	climb: number;
}
