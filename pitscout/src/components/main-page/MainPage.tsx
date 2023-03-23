import './MainPage.scss';
import React, { useState } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';

export default function MainPage() {
	const [teamNumber, setTeamNumber] = useState<string>('');

	return (
		<div className="main-page">
			<TextField
				id="team-number"
				variant="outlined"
				margin="normal"
				type="number"
				placeholder="0000"
				label="Team number"
				value={teamNumber}
				onChange={(event) => setTeamNumber(event.target.value)}
				InputProps={{
					startAdornment: <InputAdornment position="start">#</InputAdornment>
				}}
				inputProps={{
					min: 0,
					max: 9999,
					maxLength: 4
				}}
			/>
			<Button
				color="primary"
				variant="contained"
				disabled={teamNumber?.length === 0}
			>
				Upload Image
			</Button>
		</div>
	);
}
