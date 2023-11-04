import { LoadStatus } from './StateModels';

export enum FormQuestions {
	drivetrain = 'DRIVETRAIN',
	scoreLocations = 'SCORE_LOCATIONS',
	autoPaths = 'AUTO_PATHS',
	driverNotes = 'DRIVER_NOTES',
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
