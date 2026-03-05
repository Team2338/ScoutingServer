import {
	CircularProgress,
	FormControl,
	InputLabel,
	ListSubheader,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	ToggleButton,
	ToggleButtonGroup
} from '@mui/material';
import './RobotInfo.scss';
import React, { Fragment } from 'react';
import { AllianceColor, IMatchLineup } from '../../../models/models';

interface IProps {
	scheduleIsLoading: boolean;
	schedule: IMatchLineup[];
	matchNumber: string;
	teamNumber: string;
	allianceColor: AllianceColor;
	setTeamNumber: (num: string) => void;
	setAllianceColor: (string: AllianceColor) => void;
}

export default function RobotInfo(props: IProps) {

	// if is loading, hide team number and alliance color
	// else if schedule exists, show dropdown
	// else show textbox and alliance toggle

	if (props.scheduleIsLoading) {
		return (
			<div className="team-number-loader">
				<div className="textbox-placeholder">Team Number</div>
				<CircularProgress className="spin-loader" color="primary" size={ 40 } />
			</div>
		);
	}

	if (!props.schedule || props.schedule.length === 0) {
		return <ManualRobotInfo { ...props } />;
	}

	const matchIndex = Number.parseInt(props.matchNumber) - 1;
	if (Number.isNaN(matchIndex)) {
		return (
			<FormControl margin="normal">
				<InputLabel id="robot-number-label" style={ { opacity: 0.6 } }>Team Number</InputLabel>
				<Select
					id="robot-number-dropdown"
					labelId="robot-number-label"
					label="Team Number"
					value=""
					variant="outlined"
					disabled={ true }
					sx={ { width: 'calc(10em + 28px)', opacity: 0.6 } }
				>
					<MenuItem value="">None</MenuItem>
				</Select>
			</FormControl>
		);
	}

	const isValidMatchNumber: boolean = (
		matchIndex >= 0
		&& matchIndex < props.schedule.length
	);
	if (!isValidMatchNumber) {
		return <ManualRobotInfo { ...props } />;
	}

	const lineup: IMatchLineup = props.schedule[matchIndex];
	const redRobots: string[] = [lineup.red1, lineup.red2, lineup.red3].map(String);
	const blueRobots: string[] = [lineup.blue1, lineup.blue2, lineup.blue3].map(String);

	const redElements = redRobots.map((robot: string) => <MenuItem key={ robot } value={ robot }>{ robot }</MenuItem>);
	const blueElements = blueRobots.map((robot: string) => <MenuItem key={ robot } value={ robot }>{ robot }</MenuItem>);

	const handleChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		if (redRobots.includes(value)) {
			props.setTeamNumber(value);
			props.setAllianceColor(AllianceColor.red);
			return;
		}

		props.setTeamNumber(value);
		props.setAllianceColor(AllianceColor.blue);
	};

	return (
		<FormControl margin="normal">
			<InputLabel id="robot-number-label">Team Number</InputLabel>
			<Select
				id="robot-number-dropdown"
				labelId="robot-number-label"
				label="Team Number"
				value={ props.teamNumber }
				variant="outlined"
				onChange={ handleChange }
				sx={ { width: 'calc(10em + 28px)' } }
			>
				<MenuItem value="">None</MenuItem>
				<ListSubheader sx={ { color: '#AA3333', fontWeight: 600 } }>Red</ListSubheader>
				{ redElements }
				<ListSubheader sx={ { color: '#2255CC', fontWeight: 600 } }>Blue</ListSubheader>
				{ blueElements }
			</Select>
		</FormControl>
	);
}

function ManualRobotInfo(props: IProps) {
	return (
		<Fragment>
			<TextField
				id="robot-number"
				label="Team Number"
				name="robotNumber"
				type="text"
				inputMode="numeric"
				margin="normal"
				variant="outlined"
				value={ props.teamNumber }
				onChange={ (event) => props.setTeamNumber(event.target.value) }
				slotProps={{
					htmlInput: {
						minLength: 1,
						maxLength: 5,
						pattern: '[0-9]*'
					}
				}}
				autoComplete="off"
			/>
			<ToggleButtonGroup
				id="alliance-color"
				className="toggle-button-group"
				aria-label="alliance color"
				value={ props.allianceColor }
				exclusive
				onChange={ (_event, newValue) => props.setAllianceColor(newValue) }
			>
				<ToggleButton
					className="alliance-toggle red"
					value={ AllianceColor.red }
					selected={ props.allianceColor === AllianceColor.red }
					onClick={ () => props.setAllianceColor(AllianceColor.red) }
				>
					Red Alliance
				</ToggleButton>
				<ToggleButton
					className="alliance-toggle blue"
					value={ AllianceColor.blue }
					selected={ props.allianceColor === AllianceColor.blue }
					onClick={ () => props.setAllianceColor(AllianceColor.blue) }
				>
					Blue Alliance
				</ToggleButton>
			</ToggleButtonGroup>
		</Fragment>
	);
}
