import './DataCollectionPage.scss';
import React, { useState } from 'react';
import RobotInfo from './robot-info/RobotInfo';
import { AllianceColor, ClimbLevel, ICredentials, ICycle, IMatch, IMatchLineup } from '../../models/models';
import { TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CycleEstimator from './cycle-estimator/CycleEstimator';
import { dataModelService } from '../../services/DataModelService';

interface IProps {
	className?: string;
	credentials: ICredentials;
	schedule: IMatchLineup[];
	scheduleIsLoading: boolean;
	handleSubmit: (match: IMatch) => void;
}

export default function DataCollectionPage(props: IProps) {
	// Robot info
	const [matchNumber, setMatchNumber] = useState<string>('');
	const [robotNumber, setRobotNumber] = useState<string>('');
	const [allianceColor, setAllianceColor] = useState<AllianceColor>(AllianceColor.unknown);

	// Auto scores
	const [autoClimb, setAutoClimb] = useState<ClimbLevel>(ClimbLevel.none);
	const [autoCycles, setAutoCycles] = useState<ICycle[]>([]);

	// Teleop scores
	const [teleopClimb, setTeleopClimb] = useState<ClimbLevel>(ClimbLevel.none);
	const [teleopCycles, setTeleopCycles] = useState<ICycle[]>([]);

	const isValid = Boolean(
		matchNumber.trim()
		&& robotNumber.trim()
		&& allianceColor !== AllianceColor.unknown
	);

	const handleSubmit = (event) => {
		event.preventDefault();
		const match: IMatch = dataModelService.convertToRequestBody(props.credentials, {
			matchNumber: matchNumber,
			robotNumber: robotNumber,
			allianceColor: allianceColor,
			autoClimb: autoClimb,
			autoCycles: autoCycles,
			teleopClimb: teleopClimb,
			teleopCycles: teleopCycles
		});

		setMatchNumber('');
		setRobotNumber('');
		setAllianceColor(AllianceColor.unknown);
		setAutoClimb(ClimbLevel.none);
		setAutoCycles([]);
		setTeleopClimb(ClimbLevel.none);
		setTeleopCycles([]);

		props.handleSubmit(match);
	};

	return (
		<main className="page data-collection-page">
			<div className="header">
				<div className="logo">
					<img src="logos/192-pwa.png" alt="2338 logo" height="100rem" />
				</div>
				<div></div>
				<a
					className="gif-button-secondary analytics-link"
					href="https://data.gearitforward.com/"
				>
					Analytics &gt;
				</a>
			</div>
			<TextField
				id="match-number"
				label="Match Number"
				name="matchNumber"
				type="text"
				inputMode="numeric"
				margin="normal"
				variant="outlined"
				value={ matchNumber }
				onChange={ (event) => setMatchNumber(event.target.value) }
				slotProps={{
					htmlInput: {
						minLength: 1,
						maxLength: 3,
						pattern: '[0-9]*'
					}
				}}
			/>
			<RobotInfo
				scheduleIsLoading={ props.scheduleIsLoading }
				schedule={ props.schedule }
				matchNumber={ matchNumber }
				teamNumber={ robotNumber }
				allianceColor={ allianceColor }
				setTeamNumber={ setRobotNumber }
				setAllianceColor={ setAllianceColor }
			/>
			<h2 className="gamemode-title">Auto</h2>
			<h3 className="objective-title">Defenses</h3>
			<CycleEstimator
				gamemode="Auto"
				cycles={ autoCycles }
				setCycles={ setAutoCycles }
			/>
			<h3 id="auto-climb-label" className="objective-title">Climb</h3>
			<ToggleButtonGroup
				id="auto-climb"
				className="toggle-button-group"
				aria-labelledby="auto-climb-label"
				value={ autoClimb }
				defaultValue={ ClimbLevel.none }
				exclusive
				onChange={ (event, newValue) => setAutoClimb(newValue ?? autoClimb) }
			>
				<ToggleButton
					className="toggle-button"
					value={ ClimbLevel.none }
					selected={ autoClimb === ClimbLevel.none }
					onClick={ () => setAutoClimb(ClimbLevel.none) }
				>
					No
				</ToggleButton>
				<ToggleButton
					className="toggle-button"
					value={ ClimbLevel.auto }
					selected={ autoClimb === ClimbLevel.auto }
					onClick={ () => setAutoClimb(ClimbLevel.auto) }
				>
					Yes
				</ToggleButton>
			</ToggleButtonGroup>

			<h2 className="gamemode-title">Teleop</h2>
			<CycleEstimator
				gamemode="Teleop"
				cycles={ teleopCycles }
				setCycles={ setTeleopCycles }
			/>
			<h3 id="teleop-climb-label" className="objective-title">Climb</h3>
			<ToggleButtonGroup
				id="teleop-climb"
				className="toggle-button-group"
				aria-labelledby="teleop-climb-label"
				value={ teleopClimb }
				defaultValue={ ClimbLevel.none }
				exclusive
				onChange={ (event, newValue) => setTeleopClimb(newValue ?? teleopClimb) }
			>
				<ToggleButton
					className="toggle-button"
					value={ ClimbLevel.none }
					selected={ teleopClimb === ClimbLevel.none }
					onClick={ () => setTeleopClimb(ClimbLevel.none) }
				>
					None
				</ToggleButton>
				<ToggleButton
					className="toggle-button"
					value={ ClimbLevel.one }
					selected={ teleopClimb === ClimbLevel.one }
					onClick={ () => setTeleopClimb(ClimbLevel.one) }
				>
					L1
				</ToggleButton>
				<ToggleButton
					className="toggle-button"
					value={ ClimbLevel.two }
					selected={ teleopClimb === ClimbLevel.two }
					onClick={ () => setTeleopClimb(ClimbLevel.two) }
				>
					L2
				</ToggleButton>
				<ToggleButton
					className="toggle-button"
					value={ ClimbLevel.three }
					selected={ teleopClimb === ClimbLevel.three }
					onClick={ () => setTeleopClimb(ClimbLevel.three) }
				>
					L3
				</ToggleButton>
			</ToggleButtonGroup>
			<div className="action-area">
				<button
					className="gif-button-tertiary"
					onClick={ () => window.location.href = '/' }
				>
					Back
				</button>
				<button
					className="gif-button-primary"
					onClick={ handleSubmit }
					disabled={ !isValid }
				>
					Submit
				</button>
			</div>
		</main>
	);
}
