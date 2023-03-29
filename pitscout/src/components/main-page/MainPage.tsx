import { Button, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { LoadStatus } from '../../models';
import { uploadImage, useAppDispatch, useAppSelector } from '../../state';
import './MainPage.scss';

export default function MainPage() {
	const dispatch = useAppDispatch();
	const [teamNumber, setTeamNumber] = useState<string>('');
	const [file, setFile] = useState<File>(null);
	const fileInputRef = useRef(null);
	const loadStatus: LoadStatus = useAppSelector(state => state.upload.loadStatus);

	useEffect(
		() => {
			if (loadStatus === LoadStatus.success) {
				console.log('resetting')
				setTeamNumber('');
				setFile(null);
				fileInputRef.current.value = null;
			}
		},
		[loadStatus]
	);

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
			<label className="file-input-label">
				<input
					ref={fileInputRef}
					className="file-input-vanilla"
					type="file"
					accept="image/jpeg, image/jpg, image/png"
					onChange={event => setFile(event.target.files[0])}
				/>
				<div className="file-input-prompt">Choose Image</div>
				<div className="file-input-selection">
					{ file ? file.name : 'No image selected'}
				</div>
			</label>
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
