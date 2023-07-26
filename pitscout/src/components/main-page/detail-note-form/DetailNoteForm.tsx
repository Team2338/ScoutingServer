import React, { useState } from 'react';
import './DetailNoteForm.scss';
import { Statelet } from '../../../models';
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@mui/material';

const CONE_SCORE_POSITIONS: string[] = ['Cone High', 'Cone Middle', 'Cone Low'];
const CUBE_SCORE_POSITION: string[] = ['Cube High', 'Cube Middle', 'Cube Low'];

export default function DetailNoteForm() {

	const [drivetrain, setDrivetrain]: Statelet<string> = useState(null);
	const [collectorType, setCollectorType]: Statelet<string> = useState(null);
	const [elevatorType, setElevatorType]: Statelet<string> = useState(null);
	const [scoreLocations, setScoreLocations]: Statelet<string[]> = useState([]);
	const [autoPaths, setAutoPaths]: Statelet<string> = useState(null);
	const [driverNotes, setDriverNotes]: Statelet<string> = useState(null);
	const [robotNotes, setRobotNotes]: Statelet<string> = useState(null);

	const handleScoreLocationChange = (event, location: string) => {
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
			control={ <Checkbox/> }
			label={ position }
			checked={ scoreLocations.includes(position) }
			onChange={ (event) => handleScoreLocationChange(event, position) }
		/>
	);

	return (
		<form className="detail-note-form">
			<h1 className="detail-note-form__robot-number">2338</h1>
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
			></TextField>
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
			></TextField>
			<TextField
				id="robot-notes"
				name="RobotNotes"
				margin="normal"
				autoComplete="false"
				label="Notes on robot"
				value={ robotNotes }
				onChange={ (event) => setRobotNotes(event.target.value) }
			></TextField>
			<Button id="submit-note" variant="contained">Submit</Button>
		</form>
	);
}
