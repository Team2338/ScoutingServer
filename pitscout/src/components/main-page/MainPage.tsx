import { Alert, Button, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { LoadStatus, UploadErrors } from '../../models';
import { clearUploadError, uploadImage, useAppDispatch, useAppSelector } from '../../state';
import './MainPage.scss';

const ONE_MB = 1024 * 1024;
const FILE_SIZE_LIMIT = 10 * ONE_MB;

export default function MainPage() {
	const dispatch = useAppDispatch();
	const [teamNumber, setTeamNumber] = useState<string>('');
	const [file, setFile] = useState<File>(null);
	const fileInputRef = useRef(null);
	const loadStatus: LoadStatus = useAppSelector(state => state.upload.loadStatus);
	const errorMessage: string = useAppSelector(state => state.upload.error);

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

	const handleErrorToastClose = (event, reason): void => {
		if (reason === 'clickaway') {
			return;
		}

		dispatch(clearUploadError());
	}

	const isFileTooLarge: boolean = file?.size >= FILE_SIZE_LIMIT;

	return (
		<div className="main-page">
			<Snackbar
				open={!!errorMessage}
				autoHideDuration={6000}
				onClose={handleErrorToastClose}
				message={errorMessage}
				sx={{ marginTop: '64px' }}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				<Alert
					severity="error"
					variant="filled"
					sx={{ width: '100%' }}
				>
					{errorMessage}
				</Alert>
			</Snackbar>
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
			<div className="file-input">
				<label className={ 'file-input-label' + (isFileTooLarge ? ' error' : '') }>
					<input
						ref={fileInputRef}
						className="file-input-vanilla"
						type="file"
						accept="image/jpeg, image/jpg, image/png"
						onChange={event => {console.log(event.target.files); setFile(event.target.files[0])}}
						aria-invalid={isFileTooLarge}
					/>
					<div className="file-input-prompt">Choose Image</div>
					<div className="file-input-selection">
						{ file ? file.name : 'No image selected'}
					</div>
				</label>
				{
					isFileTooLarge
						? (
							<Typography
								variant="caption"
								color="error"
								id="file-input-helper-text"
								role="alert"
								aria-label={UploadErrors.fileTooLarge}
								component='div'
								sx={{ paddingLeft: '8px' }}
							>
								{ UploadErrors.fileTooLarge }
							</Typography>
						)
						: (
							<Typography
								variant="caption"
								color="#00000099"
								id="file-input-error-text"
								aria-label={ UploadErrors.fileTooLarge }
								component='div'
								sx={{ paddingLeft: '8px' }}
							>
								Must be less than 10MB
							</Typography>
						)
				}
			</div>
			<Button
				color="primary"
				variant="contained"
				disabled={teamNumber.length === 0 || !file || isFileTooLarge}
				onClick={() => dispatch(uploadImage(file, teamNumber))}
			>
				Upload Image
			</Button>
		</div>
	);
}
