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
