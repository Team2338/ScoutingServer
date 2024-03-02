import { LoadStatus } from './StateModels';

export enum FormQuestions {
	drivetrain = 'DRIVETRAIN',
	driveMotorType = 'DRIVE_MOTOR_TYPE',
	weight = 'WEIGHT',
	collectorType = 'COLLECTOR_TYPE',
	underStage = 'UNDER_STAGE',
	autoPaths = 'AUTO_PATHS',
	visionCapabilities = 'VISION_CAPABILITIES',
	scoreLocations = 'SCORE_LOCATIONS',
	intakeLocations = 'INTAKE_LOCATIONS',
	shootingLocations = 'SHOOTING_LOCATIONS',
	climbCapabilities = 'CLIMB_CAPABILITIES',
	robotNotes = 'ROBOT_NOTES'
}

export interface IForm {
	loadStatus: LoadStatus;
	error: string;
	robotNumber: number;
	questions: IFormQuestions;
}

export type IFormQuestions = {
	[key in FormQuestions]?: string;
};

export const DRIVETRAIN_TYPES: string[] = [
	'Swerve',
	'Tank',
	'Mecanum',
	'Butterfly',
	'Holonomic/Kiwi',
	'Other'
];

export const DRIVE_MOTOR_TYPES: string[] = [
	'Falcon',
	'Neo',
	'CIM'
];

export const COLLECTOR_TYPES: string[] = [
	'None',
	'Over bumber',
	'Under bumper',
	'Frame cutout'
];

export const SCORE_LOCATIONS: string[] = [
	'Amp',
	'Speaker',
	'Trap'
];

export const INTAKE_LOCATIONS: string[] = [
	'Ground',
	'HP'
];

export const SHOOTING_LOCATIONS: string[] = [
	'Subwoofer',
	'Under stage',
	'Podium',
	'Wing far',
	'Source area',
];

export const CLIMBING_CAPABILITIES: string[] = [
	'None',
	'Solo',
	'Double',
	'Triple'
];
