import './DataCollectionPage.scss';
import React, { useState } from 'react';
import RobotInfo from './robot-info/RobotInfo';
import { AllianceColor } from '../../models/models';
import { TextField } from '@mui/material';

interface IProps {
	className?: string;
}

export default function DataCollectionPage(props: IProps) {
	const [matchNumber, setMatchNumber] = useState<string>('');
	const [robotNumber, setRobotNumber] = useState<string>('');
	const [allianceColor, setAllianceColor] = useState<AllianceColor>(AllianceColor.unknown);

	return (
		<main className="page data-collection-page">
			<div className="header">header</div>
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
				scheduleIsLoading={ false }
				schedule={ null }
				matchNumber={ matchNumber }
				teamNumber={ robotNumber }
				allianceColor={ allianceColor }
				setTeamNumber={ setRobotNumber }
				setAllianceColor={ setAllianceColor }
			/>
		</main>
	);
}
