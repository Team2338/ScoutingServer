import { LoadStatus } from '@gearscout/shared-models';

export enum FormQuestions {
	drivetrain = 'DRIVETRAIN',
	driveMotorType = 'DRIVE_MOTOR_TYPE',
	weight = 'WEIGHT',
	collectorType = 'COLLECTOR_TYPE',
	underStage = 'UNDER_STAGE',
	autoPaths = 'AUTO_PATHS',
	humanPosition = 'HUMAN_POSITION',
	visionCapabilities = 'VISION_CAPABILITIES',
	scoreLocations = 'SCORE_LOCATIONS',
	intakeLocations = 'INTAKE_LOCATIONS',
	shootingLocations = 'SHOOTING_LOCATIONS',
	climbCapabilities = 'CLIMB_CAPABILITIES',
	robotNotes = 'ROBOT_NOTES',
	coralIntakeLocations = 'INTAKE_LOCATIONS_CORAL',
	algaeIntakeLocations = 'INTAKE_LOCATIONS_ALGAE',
	removeAlgae = 'REMOVE_ALGAE',
	traversableDefenses = 'TRAVERSABLE_DEFENSES',
	fuelCapacity = 'FUEL_CAPACITY',
	terrainPreference = 'TERRAIN_PREFERENCE',
	shooterType = 'SHOOTER_TYPE'
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

export const YES_AND_NO: string[] = [
	'Yes',
	'No'
];

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
	'Kraken',
	'Neo',
	'CIM'
];

export const COLLECTOR_TYPES: string[] = [
	'None',
	'Over bumper',
	'Frame cutout'
];

export const SCORE_LOCATIONS_2024: string[] = [
	'Amp',
	'Speaker',
	'Trap'
];

export const INTAKE_LOCATIONS: string[] = [
	'Ground',
	'HP'
];

export const SHOOTING_LOCATIONS_2024: string[] = [
	'Subwoofer',
	'Under stage',
	'Podium',
	'Wing far',
	'Source area',
];

export const CLIMBING_CAPABILITIES_2024: string[] = [
	'None',
	'Solo',
	'Double',
	'Triple'
];

export const CLIMBING_CAPABILITIES_2025: string[] = [
	'None',
	'Shallow',
	'Deep',
	'Both'
];

export const HUMAN_PLAYER_POSITIONS_2025: string[] = [
	'Net',
	'Feeder',
	'No preference'
];

export const SCORE_LOCATIONS_2025: string[] = [
	'L1',
	'L2',
	'L3',
	'L4',
	'Processor',
	'Net'
];

export const TRAVERSABLE_DEFENSES: string[] = [
	'Bump',
	'Trench'
];

export const SHOOTER_TYPES_2026: string[] = [
	'Turret',
	'Fixed - collector side',
	'Fixed - opposite collector',
	'Fixed - 90° offset'
];
