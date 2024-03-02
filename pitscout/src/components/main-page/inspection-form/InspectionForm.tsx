import React, { Fragment, useEffect, useState } from 'react';
import './InspectionForm.scss';
import {
	CLIMBING_CAPABILITIES,
	COLLECTOR_TYPES,
	DRIVE_MOTOR_TYPES,
	DRIVETRAIN_TYPES,
	FormQuestions,
	IForm,
	INTAKE_LOCATIONS,
	LoadStatus,
	SCORE_LOCATIONS,
	SHOOTING_LOCATIONS,
	Statelet,
} from '../../../models';
import {
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	Icon,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@mui/material';
import { AppDispatch, uploadForm, useAppDispatch, useAppSelector } from '../../../state';
import { DrivetrainIcon, MotorIcon } from '../../../icons';


interface IProps {
	robotNumber: number;
	shouldFloatSubmit?: boolean;
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

export default function InspectionForm(props: IProps) {

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

	const handleScoreLocationChange = (event, location: string): void => {
		if (event.target.checked && !scoreLocations.includes(location)) {
			setScoreLocations([...scoreLocations, location]);
			return;
		}

		if (!event.target.checked && scoreLocations.includes(location)) {
			const updatedLocations: string[] = scoreLocations.filter((loc: string) => loc !== location);
			setScoreLocations(updatedLocations);
		}
	};

	const scoreLocationCheckboxElements = SCORE_LOCATIONS.map((location: string) => (
		<FormControlLabel
			key={ location }
			control={ <Checkbox/> }
			label={ location }
			checked={ scoreLocations.includes(location) }
			onChange={ (event) => handleScoreLocationChange(event, location) }
		/>
	));

	const handleIntakeLocationChange = (event, location: string): void => {
		if (event.target.checked && !intakeLocations.includes(location)) {
			setIntakeLocations([...intakeLocations, location]);
			return;
		}

		if (!event.target.checked && intakeLocations.includes(location)) {
			const updatedLocations: string[] = intakeLocations.filter((loc: string) => loc !== location);
			setIntakeLocations(updatedLocations);
		}
	};

	const intakeLocationCheckboxElements = INTAKE_LOCATIONS.map((location: string) => (
		<FormControlLabel
			key={ location }
			control={ <Checkbox/> }
			label={ location }
			checked={ intakeLocations.includes(location) }
			onChange={ (event) => handleIntakeLocationChange(event, location) }
		/>
	));

	const handleShootingLocationChange = (event, location: string): void => {
		if (event.target.checked && !shootingLocations.includes(location)) {
			setShootingLocations([...shootingLocations, location]);
			return;
		}

		if (!event.target.checked && shootingLocations.includes(location)) {
			const updatedLocations: string[] = shootingLocations.filter((loc: string) => loc !== location);
			setShootingLocations(updatedLocations);
		}
	};

	const shootingLocationCheckboxElements = SHOOTING_LOCATIONS.map((location: string) => (
		<FormControlLabel
			key={ location }
			control={ <Checkbox/> }
			label={ location }
			checked={ shootingLocations.includes(location) }
			onChange={ (event) => handleShootingLocationChange(event, location) }
		/>
	));

	const handleClimbCapabilityChange = (event, capability: string): void => {
		if (event.target.checked && !climbCapabilities.includes(capability)) {
			setClimbCapabilities([...climbCapabilities, capability]);
			return;
		}

		if (!event.target.checked && climbCapabilities.includes(capability)) {
			const updatedCapabilities: string[] = climbCapabilities.filter((cap: string) => cap !== capability);
			setClimbCapabilities(updatedCapabilities);
		}
	};

	const climbCapabilityCheckboxElements = CLIMBING_CAPABILITIES.map((capability: string) => (
		<FormControlLabel
			key={ capability }
			control={ <Checkbox/> }
			label={ capability }
			checked={ climbCapabilities.includes(capability) }
			onChange={ (event) => handleClimbCapabilityChange(event, capability) }
		/>
	));

	const drivetrainOptionElements = DRIVETRAIN_TYPES.map((drivetrainType: string) => (
		<MenuItem key={ drivetrainType } value={ drivetrainType }>{ drivetrainType }</MenuItem>
	));

	const driveMotorOptionElements = DRIVE_MOTOR_TYPES.map((motor: string) => (
		<MenuItem key={ motor } value={ motor }>{ motor }</MenuItem>
	));

	const collectorTypeOptionElements = COLLECTOR_TYPES.map((collector: string) => (
		<MenuItem key={ collector } value={ collector }>{ collector }</MenuItem>
	));

	const handleUnderStageChange = (canGoUnderStage: boolean): void => {
		if (canGoUnderStage) {
			setUnderStage('Yes');
			return;
		}

		setUnderStage('No');
	};

	const isUploading: boolean = savedForm.loadStatus === LoadStatus.loading;

	return (
		<Fragment>
			<form className="inspection-form">
				<FormControl margin="normal">
					<InputLabel id="drivetrain-selector__label">Drivetrain</InputLabel>
					<Select
						id="drivetrain-selector"
						labelId="drivetrain-selector__label"
						value={ drivetrain }
						label="Drivetrain"
						placeholder="Drivetrain"
						onChange={ (event) => setDrivetrain(event.target.value) }
						startAdornment={ <DrivetrainIcon className="selector-adornment" /> }
					>
						{ drivetrainOptionElements }
					</Select>
				</FormControl>
				<FormControl margin="normal">
					<InputLabel id="drive-motor-selector__label">Drive motor type</InputLabel>
					<Select
						id="drive-motor-selector"
						labelId="drive-motor-selector__label"
						value={ driveMotorType }
						label="Drive motor type"
						placeholder="Drive motor type"
						onChange={ (event) => setDriveMotorType(event.target.value) }
						startAdornment={ <MotorIcon className="selector-adornment"/> }
					>
						{ driveMotorOptionElements }
					</Select>
				</FormControl>
				<TextField
					id="robot-weight-input"
					label="Robot weight"
					name="robotWeight"
					type="number"
					margin="normal"
					variant="outlined"
					value={ weight }
					onChange={ event => setWeight(event.target.value) }
					InputProps={{
						startAdornment: <InputAdornment position="start"><Icon>scale</Icon></InputAdornment>,
						endAdornment: <InputAdornment position="end">lbs</InputAdornment>
					}}
					inputProps={{
						min: 0,
						max: 9999
					}}
					autoComplete="off"
				/>
				<FormControl margin="normal">
					<InputLabel id="collector-selector__label">Collector type</InputLabel>
					<Select
						id="collector-selector"
						labelId="collector-selector__label"
						value={ collectorType }
						label="Collector type"
						placeholder="Collector type"
						onChange={ (event) => setCollectorType(event.target.value) }
						startAdornment={ <Icon className="selector-adornment">input</Icon> }
					>
						{ collectorTypeOptionElements }
					</Select>
				</FormControl>
				<FormControlLabel
					id="under-stage-checkbox"
					control={ <Checkbox /> }
					label="Can go under stage"
					checked={ underStage === 'Yes' }
					onChange={ (event: React.ChangeEvent<HTMLInputElement>) => handleUnderStageChange(event.target.checked) }
				/>
				<TextField
					id="auto-paths"
					name="AutoPaths"
					multiline={ true }
					margin="normal"
					autoComplete="off"
					label="Describe auto paths"
					value={ autoPaths }
					InputProps={{
						startAdornment: <InputAdornment position="start"><Icon>route</Icon></InputAdornment>
					}}
					inputProps={{
						maxLength: 1024
					}}
					onChange={ (event) => setAutoPaths(event.target.value) }
				/>
				<TextField
					id="vision-capabilities"
					name="VisionCapabilities"
					multiline={ true }
					margin="normal"
					autoComplete="off"
					label="Vision capabilities"
					value={ visionCapabilities }
					InputProps={{
						startAdornment: <InputAdornment position="start"><Icon>camera</Icon></InputAdornment>
					}}
					inputProps={{
						maxLength: 1024
					}}
					onChange={ (event) => setVisionCapabilities(event.target.value) }
				/>
				<div className="checkbox-group score-locations-wrapper">
					<FormGroup>
						<div className="checkbox-row">
							{ scoreLocationCheckboxElements }
						</div>
					</FormGroup>
				</div>
				<div className="checkbox-group intake-locations-wrapper">
					<FormGroup>
						<div className="checkbox-row">
							{ intakeLocationCheckboxElements }
						</div>
					</FormGroup>
				</div>
				<div className="checkbox-group shooting-locations-wrapper">
					<FormGroup>
						<div className="checkbox-row">
							{ shootingLocationCheckboxElements }
						</div>
					</FormGroup>
				</div>
				<div
					className="checkbox-group climb-capabilities-wrapper">
					<FormGroup>
						<div className="checkbox-row">
							{ climbCapabilityCheckboxElements }
						</div>
					</FormGroup>
				</div>
				<TextField
					id="robot-notes"
					name="RobotNotes"
					margin="normal"
					multiline={ true }
					autoComplete="off"
					label="Notes on robot"
					value={ robotNotes }
					InputProps={{
						startAdornment: <InputAdornment position="start"><Icon>note_alt</Icon></InputAdornment>
					}}
					inputProps={{
						maxLength: 1024
					}}
					onChange={ (event) => setRobotNotes(event.target.value) }
				/>
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
