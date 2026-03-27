import '../InspectionForm.scss';
import {
	AppDispatch,
	uploadForm,
	useAppDispatch,
	useAppSelector,
} from '../../../state';
import {
	CLIMB_HEIGHT_2026,
	CLIMB_LOCATIONS_2026,
	DRIVE_MOTOR_TYPES,
	DRIVETRAIN_TYPES,
	FormQuestions,
	IForm,
	INTAKE_LOCATIONS,
	SHOOTER_TYPES_2026,
	SHOOTING_LOCATIONS_2026,
	TRAVERSABLE_DEFENSES,
	YES_AND_NO,
} from '../../../models';
import React, { useEffect, useState } from 'react';
import Dropdown from './fields/Dropdown';
import { DrivetrainIcon, FireRateIcon, LadderIcon, MotorIcon } from '../../../icons';
import { Button, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { LoadStatus } from '@gearscout/shared-models';
import CheckboxGroup from './fields/CheckboxGroup';
import RobotWeightInput from './fields/RobotWeightInput';
import RobotNotesInput from './fields/RobotNotesInput';
import VisionCapabilitiesInput from './fields/VisionCapabilitiesInput';
import AutoPathsInput from './fields/AutoPathsInput';

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
 * Can climb in auto
 * Traversable defenses (trench or bump)
 * Preferred terrain
 * Fuel capacity
 * Intake locations (ground or HP)
 * Fire rate
 * Shooting locations
 * Can feed HP
 * Climb height (L1, L2, L3)
 * Climb locations (left, center, right, back center, other)
 */

export default function InspectionForm2026(props: IProps) {
	const dispatch: AppDispatch = useAppDispatch();
	const savedForm: IForm = useAppSelector(state => state.forms.data[props.robotNumber]);

	/* Form questions @formatter:off */
	const [drivetrain,					setDrivetrain]					= useState<string>('');
	const [driveMotorType,			setDriveMotorType]			= useState<string>('');
	const [weight,							setWeight]							= useState<string>('');
	const [visionAbilities,			setVisionAbilities]			= useState<string>('');
	const [autoPaths,						setAutoPaths]						= useState<string>('');
	const [traversableDefenses,	setTraversableDefenses]	= useState<string[]>([]);
	const [terrainPreference,		setTerrainPreference]		= useState<string>('');
	const [fuelCapacity,				setFuelCapacity]				= useState<string>('');
	const [canFeedHuman,				setCanFeedHuman]				= useState<string>('');
	const [intakeLocations,			setIntakeLocations]			= useState<string[]>([]);
	const [shooterType,					setShooterType]					= useState<string>('');
	const [fireRate,						setFireRate]						= useState<string>('');
	const [shootingLocations,		setShootingLocations]		= useState<string[]>([]);
	const [climbHeight,					setClimbHeight]					= useState<string>('');
	const [climbLocation,				setClimbLocation]				= useState<string[]>([]);
	const [canAutoClimb,				setCanAutoClimb]				= useState<string>('');
	const [robotNotes,					setRobotNotes]					= useState<string>('');
	/* End form questions @formatter:on */

	// Load saved values into the UI
	useEffect(() => {
		setDrivetrain(savedForm.questions[FormQuestions.drivetrain] ?? '');
		setDriveMotorType(savedForm.questions[FormQuestions.driveMotorType] ?? '');
		setWeight(savedForm.questions[FormQuestions.weight] ?? '');
		setAutoPaths(savedForm.questions[FormQuestions.autoPaths] ?? '');
		setCanAutoClimb(savedForm.questions[FormQuestions.canAutoClimb] ?? '');
		setVisionAbilities(savedForm.questions[FormQuestions.visionCapabilities] ?? '');
		setTraversableDefenses(savedForm.questions[FormQuestions.traversableDefenses]?.split(', ') ?? []);
		setTerrainPreference(savedForm.questions[FormQuestions.terrainPreference] ?? '');
		setFuelCapacity(savedForm.questions[FormQuestions.fuelCapacity] ?? '');
		setIntakeLocations(savedForm.questions[FormQuestions.intakeLocations]?.split(', ') ?? []);
		setShooterType(savedForm.questions[FormQuestions.shooterType] ?? '');
		setFireRate(savedForm.questions[FormQuestions.fireRate] ?? '');
		setShootingLocations(savedForm.questions[FormQuestions.shootingLocations]?.split(', ') ?? []);
		setCanFeedHuman(savedForm.questions[FormQuestions.canFeedHuman] ?? '');
		setClimbHeight(savedForm.questions[FormQuestions.climbCapabilities] ?? '');
		setClimbLocation(savedForm.questions[FormQuestions.climbLocation]?.split(', ') ?? []);
		setRobotNotes(savedForm.questions[FormQuestions.robotNotes] ?? '');
	}, [savedForm]);

	const submit = (): void => {
		dispatch(uploadForm(props.robotNumber, {
			[FormQuestions.drivetrain]: drivetrain,
			[FormQuestions.driveMotorType]: driveMotorType,
			[FormQuestions.weight]: weight,
			[FormQuestions.autoPaths]: autoPaths,
			[FormQuestions.canAutoClimb]: canAutoClimb,
			[FormQuestions.visionCapabilities]: visionAbilities,
			[FormQuestions.traversableDefenses]: traversableDefenses.join(', '),
			[FormQuestions.terrainPreference]: terrainPreference,
			[FormQuestions.fuelCapacity]: fuelCapacity,
			[FormQuestions.intakeLocations]: intakeLocations.join(', '),
			[FormQuestions.shooterType]: shooterType,
			[FormQuestions.fireRate]: fireRate,
			[FormQuestions.shootingLocations]: shootingLocations.join(', '),
			[FormQuestions.canFeedHuman]: canFeedHuman,
			[FormQuestions.climbCapabilities]: climbHeight,
			[FormQuestions.climbLocation]: climbLocation.join(', '),
			[FormQuestions.robotNotes]: robotNotes
		}));
	};

	// Example GDrive link that will embed properly
	// https://drive.google.com/thumbnail?id=1keGBJoyfB1DWbm7Ga1WBGvpQxIvycn0k&sz=w1024

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
			<Dropdown
				id="can-auto-climb"
				title="Can climb in auto"
				options={ YES_AND_NO }
				value={ canAutoClimb }
				onChange={ setCanAutoClimb }
			/>
			<VisionCapabilitiesInput value={ visionAbilities } onChange={ setVisionAbilities } />
			<CheckboxGroup
				title="Traversable defenses"
				options={ TRAVERSABLE_DEFENSES }
				values={ traversableDefenses }
				includeNoneOption={ true }
				onChange={ setTraversableDefenses }
			/>
			<Dropdown
				id="terrain-preference"
				title="Terrain preference"
				options={ TRAVERSABLE_DEFENSES }
				value={ terrainPreference }
				onChange={ setTerrainPreference }
			/>
			<TextField
				id="fuel-capacity-input"
				label="Fuel capacity"
				name="fuelCapacity"
				type="number"
				margin="normal"
				variant="outlined"
				value={ fuelCapacity }
				onChange={ (event) => setFuelCapacity(event.target.value) }
				slotProps={{
					htmlInput: {
						min: 0,
						max: 99,
					},
				}}
				autoComplete="off"
			/>
			<CheckboxGroup
				title="Intake locations"
				options={ INTAKE_LOCATIONS }
				values={ intakeLocations }
				includeNoneOption={ true }
				onChange={ setIntakeLocations }
			/>
			<Dropdown
				id="shooter-type-dropdown"
				title="Shooter type"
				options={ SHOOTER_TYPES_2026 }
				value={ shooterType }
				onChange={ setShooterType }
			/>
			<TextField
				id="fire-rate-input"
				label="Fire rate"
				name="fireRate"
				type="number"
				margin="normal"
				variant="outlined"
				value={ fireRate }
				onChange={ (event) => setFireRate(event.target.value) }
				slotProps={{
					input: {
						startAdornment: <InputAdornment position="start"><FireRateIcon /></InputAdornment>,
						endAdornment: <InputAdornment position="end">fps</InputAdornment>
					},
					htmlInput: {
						min: 0,
						max: 99,
					},
				}}
				autoComplete="off"
			/>
			<CheckboxGroup
				title="Shooting locations"
				options={ SHOOTING_LOCATIONS_2026 }
				values={ shootingLocations }
				includeNoneOption={ true }
				onChange={ setShootingLocations }
			/>
			<Dropdown
				id="can-feed-human"
				title="Can feed human"
				options={ YES_AND_NO }
				value={ canFeedHuman }
				onChange={ setCanFeedHuman }
			/>
			<Dropdown
				id="climb-height-selector"
				title="Climb height"
				options={ CLIMB_HEIGHT_2026 }
				value={ climbHeight }
				onChange={ setClimbHeight }
				icon={ <LadderIcon className="selector-adornment" /> }
			/>
			<CheckboxGroup
				title="Climb locations"
				options={ CLIMB_LOCATIONS_2026 }
				values={ climbLocation }
				includeNoneOption={ true }
				onChange={ setClimbLocation }
			/>
			<RobotNotesInput value={ robotNotes } onChange={ setRobotNotes } />
			<Button
				id="submit-note"
				variant="contained"
				onClick={ submit }
				disabled={ isUploading }
			>
				Submit
				{ isUploading && (
					<CircularProgress
						id="submit-note__loader"
						color="secondary"
						size={ 24 }
					/>
				)}
			</Button>
		</form>
	);
}
