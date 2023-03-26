import './MainPage.scss';
import React, { useState } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { uploadImage, useAppDispatch } from '../../state';

export default function MainPage() {
	const dispatch = useAppDispatch();
	const [teamNumber, setTeamNumber] = useState<string>('');
	const [file, setFile] = useState(null);

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
			<input
				type="file"
				accept="image/jpeg, image/jpg, image/png"
				onChange={event => setFile(event.target.files[0])}
			/>
			<Button
				color="primary"
				variant="contained"
				disabled={teamNumber?.length === 0 || !file}
				onClick={() => dispatch(uploadImage(file, teamNumber))}
			>
				Upload Image
			</Button>
		</div>
	);
}
