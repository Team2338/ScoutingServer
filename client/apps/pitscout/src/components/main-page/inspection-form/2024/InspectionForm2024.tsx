import React, {
	Fragment,
	useEffect,
	useState
} from 'react';
import '../InspectionForm.scss';
import {
	CLIMBING_CAPABILITIES_2024,
	COLLECTOR_TYPES,
	DRIVE_MOTOR_TYPES,
	DRIVETRAIN_TYPES,
	FormQuestions,
	IForm,
	INTAKE_LOCATIONS,
	SCORE_LOCATIONS_2024,
	SHOOTING_LOCATIONS,
	Statelet,
	YES_AND_NO
} from '../../../../models';
import {
	Button,
	CircularProgress,
	Icon,
} from '@mui/material';
import {
	AppDispatch,
	uploadForm,
	useAppDispatch,
	useAppSelector
} from '../../../../state';
import {
	DrivetrainIcon,
	MotorIcon
} from '../../../../icons';
import { LoadStatus } from '@gearscout/models';
import Dropdown from '../fields/Dropdown';
import RobotWeightInput from '../fields/RobotWeightInput';
import RobotNotesInput from '../fields/RobotNotesInput';
import CheckboxGroup from '../fields/CheckboxGroup';
import VisionCapabilitiesInput from '../fields/VisionCapabilitiesInput';
import AutoPathsInput from '../fields/AutoPathsInput';


interface IProps {
	robotNumber: number;
}

/*
 * 2024 fields:
 * Drivetrain type
 * Motor type (on drivetrain)
 * Robot weight
 * Vision capabilities
 *
 * Under stage (yes/no)
 * Autos
 * Scoring places (amp, speaker, trap)
 * Intake location (ground or HP)
 * Shooting location (Subwoofer, podium, wing line)
 * Climbing capabilities (solo, harmonize, triple climb)
 */

export default function InspectionForm2024(props: IProps) {

	const dispatch: AppDispatch = useAppDispatch();
	const savedForm: IForm = useAppSelector(state => state.forms.data[props.robotNumber]);

	/* Form questions */
	const [drivetrain, setDrivetrain]: Statelet<string> = useState('');
	const [driveMotorType, setDriveMotorType]: Statelet<string> = useState('');
	const [weight, setWeight]: Statelet<string> = useState('');
	const [collectorType, setCollectorType]: Statelet<string> = useState('');
	const [underStage, setUnderStage]: Statelet<string> = useState('');
	const [autoPaths, setAutoPaths]: Statelet<string> = useState('');
	const [visionCapabilities, setVisionCapabilities]: Statelet<string> = useState('');
	const [scoreLocations, setScoreLocations]: Statelet<string[]> = useState([]);
	const [intakeLocations, setIntakeLocations]: Statelet<string[]> = useState([]);
	const [shootingLocations, setShootingLocations]: Statelet<string[]> = useState([]);
	const [climbCapabilities, setClimbCapabilities]: Statelet<string[]> = useState([]);
	const [robotNotes, setRobotNotes]: Statelet<string> = useState('');
	/* End form questions */

	useEffect(() => {
		setDrivetrain(savedForm.questions[FormQuestions.drivetrain] ?? '');
		setDriveMotorType(savedForm.questions[FormQuestions.driveMotorType] ?? '');
		setWeight(savedForm.questions[FormQuestions.weight] ?? '');
		setCollectorType(savedForm.questions[FormQuestions.collectorType] ?? '');
		setUnderStage(savedForm.questions[FormQuestions.underStage] ?? '');
		setAutoPaths(savedForm.questions[FormQuestions.autoPaths] ?? '');
		setVisionCapabilities(savedForm.questions[FormQuestions.visionCapabilities] ?? '');
		setScoreLocations((savedForm.questions[FormQuestions.scoreLocations]?.split(', ') ?? []));
		setIntakeLocations((savedForm.questions[FormQuestions.intakeLocations]?.split(', ') ?? []));
		setShootingLocations((savedForm.questions[FormQuestions.shootingLocations]?.split(', ') ?? []));
		setClimbCapabilities((savedForm.questions[FormQuestions.climbCapabilities]?.split(', ') ?? []));
		setRobotNotes(savedForm.questions[FormQuestions.robotNotes] ?? '');
	}, [savedForm]);

	const submit = (): void => {
		dispatch(uploadForm(props.robotNumber, {
			[FormQuestions.drivetrain]: drivetrain,
			[FormQuestions.driveMotorType]: driveMotorType,
			[FormQuestions.weight]: weight,
			[FormQuestions.collectorType]: collectorType,
			[FormQuestions.underStage]: underStage,
			[FormQuestions.autoPaths]: autoPaths,
			[FormQuestions.visionCapabilities]: visionCapabilities,
			[FormQuestions.scoreLocations]: scoreLocations.join(', '),
			[FormQuestions.intakeLocations]: intakeLocations.join(', '),
			[FormQuestions.shootingLocations]: shootingLocations.join(', '),
			[FormQuestions.climbCapabilities]: climbCapabilities.join(', '),
			[FormQuestions.robotNotes]: robotNotes
		}));
	};

	const isUploading: boolean = savedForm.loadStatus === LoadStatus.loading;

	return (
		<Fragment>
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
				<RobotWeightInput value={ weight } onChange={setWeight } />
				<Dropdown
					id="collector-selector"
					title="Collector type"
					options={ COLLECTOR_TYPES }
					value={ collectorType }
					onChange={ setCollectorType }
					icon={ <Icon className="selector-adornment">input</Icon> }
				/>
				<Dropdown
					id="under-stage-selector"
					title="Can go under stage"
					options={ YES_AND_NO }
					value={ underStage }
					onChange={ setUnderStage }
				/>
				<AutoPathsInput value={ autoPaths } onChange={ setAutoPaths } />
				<VisionCapabilitiesInput value={ visionCapabilities } onChange={ setVisionCapabilities } />
				<CheckboxGroup
					title="Score locations"
					options={ SCORE_LOCATIONS_2024 }
					values={ scoreLocations }
					onChange={ setScoreLocations }
				/>
				<CheckboxGroup
					title="Intake locations"
					options={ INTAKE_LOCATIONS }
					values={ intakeLocations }
					onChange={ setIntakeLocations }
				/>
				<CheckboxGroup
					title="Shooting locations"
					options={ SHOOTING_LOCATIONS }
					values={ shootingLocations }
					onChange={ setShootingLocations }
				/>
				<CheckboxGroup
					title="Climb capabilities"
					options={ CLIMBING_CAPABILITIES_2024 }
					values={ climbCapabilities }
					onChange={ setClimbCapabilities }
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
		</Fragment>
	);
}
