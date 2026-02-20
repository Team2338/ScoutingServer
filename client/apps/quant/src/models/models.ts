export interface ICredentials {
	teamNumber: string;
	scouterName: string;
	eventCode: string;
	secretCode: string;
	tbaCode: string;
}

export enum AllianceColor {
	red = 'RED',
	blue = 'BLUE',
	unknown = 'UNKNOWN'
}

export enum ClimbLevel {
	none = 0,
	auto = 15,
	one = 10,
	two = 20,
	three = 30
}

export interface IMatchLineup {
	matchNumber: number;
	red1: number;
	red2: number;
	red3: number;
	blue1: number;
	blue2: number;
	blue3: number;
}

export interface ICycle {
	size: CycleSize;
	accuracy: number;
}

export enum CycleSize {
	small = 'small',
	medium = 'medium',
	large = 'large'
}

export interface IMatch {
	gameYear: number;
	eventCode: string;
	matchNumber: string;
	robotNumber: string;
	creator: string;
	allianceColor: string;
	objectives: IObjective[];
}

export interface IObjective {
	gamemode: Gamemode,
	objective: string;
	count: number;
	list?: number[];
}

export enum Gamemode {
	teleop = 'TELEOP',
	auto = 'AUTO'
}

export interface IMatchUi2026 {
	matchNumber: string;
	robotNumber: string;
	allianceColor: AllianceColor;
	autoClimb: ClimbLevel;
	autoCycles: ICycle[];
	teleopClimb: ClimbLevel;
	teleopCycles: ICycle[];
}
