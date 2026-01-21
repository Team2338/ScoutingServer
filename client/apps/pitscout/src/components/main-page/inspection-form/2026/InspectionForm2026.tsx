import {
	AppDispatch,
	uploadForm,
	useAppDispatch,
	useAppSelector
} from '../../../../state';
import {
	CLIMB_HEIGHT_2026, CLIMB_LOCATIONS_2026,
	CLIMBING_CAPABILITIES_2025,
	DRIVE_MOTOR_TYPES,
	DRIVETRAIN_TYPES,
	FormQuestions,
	HUMAN_PLAYER_POSITIONS_2025,
	IForm, INTAKE_LOCATIONS,
	SCORE_LOCATIONS_2025, SHOOTING_LOCATIONS_2026, TRAVERSABLE_DEFENSES,
	YES_AND_NO
} from '../../../../models';
import React, {
	useEffect,
	useState
} from 'react';
import Dropdown from '../fields/Dropdown';
import {
	DrivetrainIcon,
	MotorIcon
} from '../../../../icons';
import {
	Button,
	CircularProgress,
} from '@mui/material';
import { LoadStatus } from '@gearscout/models';
import CheckboxGroup from '../fields/CheckboxGroup';
import '../InspectionForm.scss';
import RobotWeightInput from '../fields/RobotWeightInput';
import RobotNotesInput from '../fields/RobotNotesInput';
import {
	DirectionsRun,
	Phishing
} from '@mui/icons-material';
import VisionCapabilitiesInput from '../fields/VisionCapabilitiesInput';
import AutoPathsInput from '../fields/AutoPathsInput';

interface IProps {
	robotNumber: number;
}

/*
 * 2026 fields:
 * Drivetrain type
 * Motor type (on drivetrain)
 * Robot weight
 * Vision capabilities
 *
 * Autos (depot, HP, neutral zone)
 * Traversable defenses (trench or bump)
 * Preferred HP position
 * Can feed HP
 * Intake location (ground or HP)
 * Climb height (L1, L2, L3)
 * Climb position (left, center, right, back center, other)
 * Can climb in auto
 */

export default function InspectionForm2025(props: IProps) {

	const dispatch: AppDispatch = useAppDispatch();
	const savedForm: IForm = useAppSelector(state => state.forms.data[props.robotNumber]);

	/* Form questions */
	const [drivetrain, 				setDrivetrain]				= useState<string>('');
	const [driveMotorType,		setDriveMotorType]		= useState<string>('');
	const [weight,						setWeight]						= useState<string>('');
	const [visionAbilities,		setVisionAbilities]		= useState<string>('');
	const [autoPaths,					setAutoPaths]					= useState<string>('');
	const [traversableDefenses,	setTraversableDefenses]	= useState<string[]>([]);
	const [canFeedHuman,			setCanFeedHuman]			= useState<string>('');
	const [intakeLocations,		setIntakeLocations]		= useState<string[]>([]);
	const [shootingLocations,	setShootingLocations]	= useState<string[]>([]);
	const [climbHeight,				setClimbHeight]				= useState<string>('');
	const [climbLocation,			setClimbLocation]			= useState<string[]>([]);
	const [canAutoClimb,			setCanAutoClimb]			= useState<string>('');
	const [robotNotes,				setRobotNotes]				= useState<string>('');
	/* End form questions */

	useEffect(() => {
		setDrivetrain(savedForm.questions[FormQuestions.drivetrain] ?? '');
		setDriveMotorType(savedForm.questions[FormQuestions.driveMotorType] ?? '');
		setWeight(savedForm.questions[FormQuestions.weight] ?? '');
		setVisionAbilities(savedForm.questions[FormQuestions.visionCapabilities] ?? '');
		setAutoPaths(savedForm.questions[FormQuestions.autoPaths] ?? '');
		setTraversableDefenses(savedForm.questions[FormQuestions.traversableDefenses]?.split(', ') ?? []);
		setCanFeedHuman(savedForm.questions[FormQuestions.canFeedHuman] ?? '');
		setIntakeLocations(savedForm.questions[FormQuestions.intakeLocations]?.split(', ') ?? []);
		setShootingLocations(savedForm.questions[FormQuestions.shootingLocations]?.split(', ') ?? []);
		setClimbHeight(savedForm.questions[FormQuestions.climbHeight] ?? '');
		setClimbLocation(savedForm.questions[FormQuestions.climbLocation]?.split(', ') ?? []);
		setCanAutoClimb(savedForm.questions[FormQuestions.canAutoClimb] ?? '');
		setRobotNotes(savedForm.questions[FormQuestions.robotNotes] ?? '');
	}, [savedForm]);

	const submit = (): void => {
		dispatch(uploadForm(props.robotNumber, {
			[FormQuestions.drivetrain]: drivetrain,
			[FormQuestions.driveMotorType]: driveMotorType,
			[FormQuestions.weight]: weight,
			[FormQuestions.visionCapabilities]: visionAbilities,
			[FormQuestions.autoPaths]: autoPaths,
			[FormQuestions.traversableDefenses]: traversableDefenses.join(', '),
			[FormQuestions.canFeedHuman]: canFeedHuman,
			[FormQuestions.intakeLocations]: intakeLocations.join(', '),
			[FormQuestions.shootingLocations]: shootingLocations.join(', '),
			[FormQuestions.climbCapabilities]: climbHeight,
			[FormQuestions.climbLocation]: climbLocation.join(', '),
			[FormQuestions.canAutoClimb]: canAutoClimb,
			[FormQuestions.robotNotes]: robotNotes
		}));
	};

	const isUploading: boolean = savedForm.loadStatus === LoadStatus.loading;

	return (
		<form className="inspection-form">
			<Dropdown
				id="drivetrain-selector"
				title="Drivetrain"
				options={ DRIVETRAIN_TYPES }
				value={ drivetrain }
				onChange={ setDrivetrain }
				icon={ <DrivetrainIcon className="selector-adornment" /> }
			/>
			<Dropdown
				id="drive-motor-selector"
				title="Drive motor type"
				options={ DRIVE_MOTOR_TYPES }
				value={ driveMotorType }
				onChange={ setDriveMotorType }
				icon={ <MotorIcon className="selector-adornment" /> }
			/>
			<RobotWeightInput value={ weight } onChange={ setWeight } />
			<AutoPathsInput value={ autoPaths } onChange={ setAutoPaths } />
			<VisionCapabilitiesInput value={ visionAbilities } onChange={ setVisionAbilities } />
			<CheckboxGroup
				title="Traversable defenses"
				options={ TRAVERSABLE_DEFENSES }
				values={ traversableDefenses }
				includeNoneOption={ true }
				onChange={ setTraversableDefenses }
			/>
			<Dropdown
				id="can-feed-human"
				title="Can feed human"
				options={ YES_AND_NO }
				value={ canFeedHuman }
				onChange={ setCanFeedHuman }
			/>
			<CheckboxGroup
				title="Intake locations"
				options={ INTAKE_LOCATIONS }
				values={ intakeLocations }
				includeNoneOption={ true }
				onChange={ setIntakeLocations }
			/>
			<CheckboxGroup
				title="Shooting locations"
				options={ SHOOTING_LOCATIONS_2026 }
				values={ shootingLocations }
				includeNoneOption={ true }
				onChange={ setShootingLocations }
			/>
			<Dropdown
				id="climb-height-selector"
				title="Climb height"
				options={ CLIMB_HEIGHT_2026 }
				value={ climbHeight }
				onChange={ setClimbHeight }
				icon={ <Phishing className="selector-adornment" /> }
			/>
			<CheckboxGroup
				title="Climb locations"
				options={ CLIMB_LOCATIONS_2026 }
				values={ climbLocation }
				onChange={ setClimbLocation }
			/>
			<Dropdown
				id="can-auto-climb"
				title="Can climb in auto"
				options={ YES_AND_NO }
				value={ canAutoClimb }
				onChange={ setCanAutoClimb }
			/>
			<RobotNotesInput value={ robotNotes } onChange={ setRobotNotes } />
			<Button
				id="submit-note"
				variant="contained"
				onClick={ submit }
				disabled={ isUploading }
			>
				Submit
				{
					isUploading && (
						<CircularProgress
							id="submit-note__loader"
							color="secondary"
							size={ 24 }
						/>
					)
				}
			</Button>
		</form>
	);
}
