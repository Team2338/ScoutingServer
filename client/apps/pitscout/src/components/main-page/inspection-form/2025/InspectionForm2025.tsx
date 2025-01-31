import {
	AppDispatch,
	uploadForm,
	useAppDispatch,
	useAppSelector
} from '../../../../state';
import {
	CLIMBING_CAPABILITIES_2025,
	DRIVE_MOTOR_TYPES,
	DRIVETRAIN_TYPES,
	FormQuestions,
	HUMAN_PLAYER_POSITIONS_2025,
	IForm,
	SCORE_LOCATIONS_2025,
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
 * 2025 fields:
 * Drivetrain type
 * Motor type (on drivetrain)
 * Robot weight
 * Vision capabilities
 *
 * Autos
 * Preferred HP position
 * Can remove algae (yes/no)
 * Scoring places (L1-4, net, processor)
 * Intake location (ground or HP)
 * Climbing capabilities (none or shallow/deep cage)
 */

export default function InspectionForm2025(props: IProps) {

	const dispatch: AppDispatch = useAppDispatch();
	const savedForm: IForm = useAppSelector(state => state.forms.data[props.robotNumber]);

	/* Form questions */
	const [drivetrain, 			setDrivetrain]			= useState<string>('');
	const [driveMotorType,	setDriveMotorType]	= useState<string>('');
	const [weight,					setWeight]					= useState<string>('');
	const [visionCapabilities, setVisionCapabilities]	= useState<string>('');
	const [autoPaths,				setAutoPaths]				= useState<string>('');
	const [canRemoveAlgae,	setCanRemoveAlgae]	= useState<string>('');
	const [humanPosition,		setHumanPosition]		= useState<string>('');
	const [scoreLocations,	setScoreLocations]	= useState<string[]>([]);
	const [intakeLocations,	setIntakeLocations]	= useState<string[]>([]);
	const [climbHeight,			setClimbHeight]			= useState<string>('');
	const [robotNotes,			setRobotNotes]			= useState<string>('');
	/* End form questions */

	useEffect(() => {
		setDrivetrain(savedForm.questions[FormQuestions.drivetrain] ?? '');
		setDriveMotorType(savedForm.questions[FormQuestions.driveMotorType] ?? '');
		setWeight(savedForm.questions[FormQuestions.weight] ?? '');
		setVisionCapabilities(savedForm.questions[FormQuestions.visionCapabilities] ?? '');
		setAutoPaths(savedForm.questions[FormQuestions.autoPaths] ?? '');
		setCanRemoveAlgae(savedForm.questions[FormQuestions.removeAlgae] ?? '');
		setHumanPosition(savedForm.questions[FormQuestions.humanPosition] ?? '');
		setScoreLocations(savedForm.questions[FormQuestions.scoreLocations]?.split(', ') ?? []);
		setIntakeLocations(savedForm.questions[FormQuestions.intakeLocations]?.split(', ') ?? []);
		setClimbHeight(savedForm.questions[FormQuestions.climbCapabilities] ?? '');
		setRobotNotes(savedForm.questions[FormQuestions.robotNotes] ?? '');
	}, [savedForm]);

	const submit = (): void => {
		dispatch(uploadForm(props.robotNumber, {
			[FormQuestions.drivetrain]: drivetrain,
			[FormQuestions.driveMotorType]: driveMotorType,
			[FormQuestions.weight]: weight,
			[FormQuestions.visionCapabilities]: visionCapabilities,
			[FormQuestions.autoPaths]: autoPaths,
			[FormQuestions.removeAlgae]: canRemoveAlgae,
			[FormQuestions.humanPosition]: humanPosition,
			[FormQuestions.scoreLocations]: scoreLocations.join(', '),
			[FormQuestions.intakeLocations]: intakeLocations.join(', '),
			[FormQuestions.climbCapabilities]: climbHeight,
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
			<VisionCapabilitiesInput value={ visionCapabilities } onChange={ setVisionCapabilities } />
			<CheckboxGroup
				title="Intake locations"
				options={ ['HP', 'Floor'] }
				values={ intakeLocations }
				onChange={ setIntakeLocations }
			/>
			<CheckboxGroup
				title="Score locations"
				options={ SCORE_LOCATIONS_2025 }
				values={ scoreLocations }
				onChange={ setScoreLocations }
			/>
			<Dropdown
				id="remove-algae-selector"
				title="Can remove algae"
				options={ YES_AND_NO }
				value={ canRemoveAlgae }
				onChange={ setCanRemoveAlgae }
			/>
			<Dropdown
				id="human-position-selector"
				title="HP location"
				options={ HUMAN_PLAYER_POSITIONS_2025 }
				value={ humanPosition }
				onChange={ setHumanPosition }
				icon={ <DirectionsRun className="selector-adornment" /> }
			/>
			<Dropdown
				id="climb-height-selector"
				title="Climb height"
				options={ CLIMBING_CAPABILITIES_2025 }
				value={ climbHeight }
				onChange={ setClimbHeight }
				icon={ <Phishing className="selector-adornment" /> }
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
