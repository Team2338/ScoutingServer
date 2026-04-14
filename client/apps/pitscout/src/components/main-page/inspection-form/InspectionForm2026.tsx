import './InspectionForm.scss';
import {
	AppDispatch,
	uploadForm,
	useAppDispatch,
	useAppSelector,
} from '../../../state';
import {
	DRIVE_MOTOR_TYPES,
	DRIVETRAIN_TYPES,
	FormQuestions,
	IForm,
	SHOOTER_TYPES_2026,
	TRAVERSABLE_DEFENSES,
} from '../../../models';
import React, { useEffect, useState } from 'react';
import Dropdown from './fields/Dropdown';
import { DrivetrainIcon, MotorIcon } from '../../../icons';
import { Button, CircularProgress, TextField } from '@mui/material';
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
	const [shooterType,					setShooterType]					= useState<string>('');
	const [robotNotes,					setRobotNotes]					= useState<string>('');
	/* End form questions @formatter:on */

	// Load saved values into the UI
	useEffect(() => {
		setDrivetrain(savedForm.questions[FormQuestions.drivetrain] ?? '');
		setDriveMotorType(savedForm.questions[FormQuestions.driveMotorType] ?? '');
		setWeight(savedForm.questions[FormQuestions.weight] ?? '');
		setAutoPaths(savedForm.questions[FormQuestions.autoPaths] ?? '');
		setVisionAbilities(savedForm.questions[FormQuestions.visionCapabilities] ?? '');
		setTraversableDefenses(savedForm.questions[FormQuestions.traversableDefenses]?.split(', ') ?? []);
		setTerrainPreference(savedForm.questions[FormQuestions.terrainPreference] ?? '');
		setFuelCapacity(savedForm.questions[FormQuestions.fuelCapacity] ?? '');
		setShooterType(savedForm.questions[FormQuestions.shooterType] ?? '');
		setRobotNotes(savedForm.questions[FormQuestions.robotNotes] ?? '');
	}, [savedForm]);

	const submit = (): void => {
		dispatch(uploadForm(props.robotNumber, {
			[FormQuestions.drivetrain]: drivetrain,
			[FormQuestions.driveMotorType]: driveMotorType,
			[FormQuestions.weight]: weight,
			[FormQuestions.autoPaths]: autoPaths,
			[FormQuestions.visionCapabilities]: visionAbilities,
			[FormQuestions.traversableDefenses]: traversableDefenses.join(', '),
			[FormQuestions.terrainPreference]: terrainPreference,
			[FormQuestions.fuelCapacity]: fuelCapacity,
			[FormQuestions.shooterType]: shooterType,
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
			<Dropdown
				id="shooter-type-dropdown"
				title="Shooter type"
				options={ SHOOTER_TYPES_2026 }
				value={ shooterType }
				onChange={ setShooterType }
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
