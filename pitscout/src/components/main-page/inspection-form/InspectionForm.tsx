import React, { Fragment, useEffect, useState } from 'react';
import './InspectionForm.scss';
import { FormQuestions, IForm, LoadStatus, Statelet, UserRoles } from '../../../models';
import {
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@mui/material';
import { AppDispatch, uploadForm, useAppDispatch, useAppSelector } from '../../../state';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddImageDialog from './add-image-dialog/AddImageDialog';

const CONE_SCORE_POSITIONS: string[] = ['Cone High', 'Cone Middle', 'Cone Low'];
const CUBE_SCORE_POSITION: string[] = ['Cube High', 'Cube Middle', 'Cube Low'];

interface IProps {
	robotNumber: number;
}

export default function InspectionForm(props: IProps) {

	const dispatch: AppDispatch = useAppDispatch();
	const [isImageModalOpen, setImageModalOpen]: Statelet<boolean> = useState(false);
	const [drivetrain, setDrivetrain]: Statelet<string> = useState('');
	// const [collectorType, setCollectorType]: Statelet<string> = useState('');
	// const [elevatorType, setElevatorType]: Statelet<string> = useState('');
	const [scoreLocations, setScoreLocations]: Statelet<string[]> = useState([]);
	const [autoPaths, setAutoPaths]: Statelet<string> = useState('');
	const [driverNotes, setDriverNotes]: Statelet<string> = useState('');
	const [robotNotes, setRobotNotes]: Statelet<string> = useState('');
	const savedForm: IForm = useAppSelector(state => state.forms.data[props.robotNumber]);
	const role: UserRoles = useAppSelector(state => state.login.token.role);

	useEffect(() => {
		setImageModalOpen(false);
		setDrivetrain(savedForm.questions[FormQuestions.drivetrain] ?? '');
		setScoreLocations(savedForm.questions[FormQuestions.scoreLocations]?.split(', ') ?? []);
		setAutoPaths(savedForm.questions[FormQuestions.autoPaths] ?? '');
		setDriverNotes(savedForm.questions[FormQuestions.driverNotes] ?? '');
		setRobotNotes(savedForm.questions[FormQuestions.robotNotes] ?? '');
	}, [savedForm]);

	const submit = (): void => {
		dispatch(uploadForm(props.robotNumber, {
			[FormQuestions.drivetrain]: drivetrain,
			[FormQuestions.scoreLocations]: scoreLocations.join(', '),
			[FormQuestions.autoPaths]: autoPaths,
			[FormQuestions.driverNotes]: driverNotes,
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

	const convertLocationToCheckbox = (position: string) => (
		<FormControlLabel
			key={ position }
			control={ <Checkbox/> }
			label={ position }
			checked={ scoreLocations.includes(position) }
			onChange={ (event) => handleScoreLocationChange(event, position) }
		/>
	);

	const addImageButton = role === UserRoles.admin && (
		<Button
			id="add-image-button"
			aria-label="Add image"
			color="primary"
			variant="contained"
			startIcon={ <AddPhotoAlternateIcon/> }
			disableElevation={ true }
			onClick={ () => setImageModalOpen(true) }
		>
			Add image
		</Button>
	);

	const isUploading: boolean = savedForm.loadStatus === LoadStatus.loading;

	return (
		<Fragment>
			<form className="detail-note-form">
				<div className="title-area">
					<h1 className="title">{ props.robotNumber }</h1>
					{ addImageButton }
				</div>
				<FormControl margin="dense">
					<InputLabel id="drivetrain-selector__label">Drivetrain</InputLabel>
					<Select
						id="drivetrain-selector"
						labelId="drivetrain-selector__label"
						value={ drivetrain }
						label="Drivetrain"
						placeholder="Drivetrain"
						onChange={ (event) => setDrivetrain(event.target.value) }
					>
						<MenuItem value="Swerve">Swerve</MenuItem>
						<MenuItem value="Tank">Tank</MenuItem>
						<MenuItem value="Mecanum">Mecanum</MenuItem>
						<MenuItem value="Butterfly">Butterfly</MenuItem>
						<MenuItem value="Holonomic/Kiwi">Holonomic/Kiwi</MenuItem>
						<MenuItem value="Other">Other</MenuItem>
					</Select>
				</FormControl>
				<TextField
					id="auto-paths"
					name="AutoPaths"
					margin="normal"
					autoComplete="false"
					label="Describe auto paths"
					value={ autoPaths }
					onChange={ (event) => setAutoPaths(event.target.value) }
				/>
				<div className="score-locations-wrapper">
					<FormGroup>
						<div className="score-locations">
							<div className="score-locations__section">
								{ CONE_SCORE_POSITIONS.map(convertLocationToCheckbox) }
							</div>
							<div className="score-locations__section">
								{ CUBE_SCORE_POSITION.map(convertLocationToCheckbox) }
							</div>
						</div>
					</FormGroup>
				</div>
				<TextField
					id="driver-notes"
					name="DriverNotes"
					margin="normal"
					autoComplete="false"
					label="Notes on drivers"
					value={ driverNotes }
					onChange={ (event) => setDriverNotes(event.target.value) }
				/>
				<TextField
					id="robot-notes"
					name="RobotNotes"
					margin="normal"
					autoComplete="false"
					label="Notes on robot"
					value={ robotNotes }
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
			<AddImageDialog
				robotNumber={ props.robotNumber }
				isOpen={ isImageModalOpen }
				handleClose={ () => setImageModalOpen(false) }
			/>
		</Fragment>
	);
}
