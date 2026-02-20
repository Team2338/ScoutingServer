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

export interface IMatchLineup {
	matchNumber: number;
	red1: number;
	red2: number;
	red3: number;
	blue1: number;
	blue2: number;
	blue3: number;
}
