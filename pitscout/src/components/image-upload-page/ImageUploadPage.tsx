import { Alert, Button, InputAdornment, Snackbar, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LoadStatus, UploadErrors } from '../../models';
import { clearUploadError, uploadImage, useAppDispatch, useAppSelector } from '../../state';
import './ImageUploadPage.scss';
import ImagePicker from '../image-picker/ImagePicker';

const ONE_MB: number = 1024 * 1024;
const FILE_SIZE_LIMIT_MEGABYTES: number = 10;
const FILE_SIZE_LIMIT: number = FILE_SIZE_LIMIT_MEGABYTES * ONE_MB;

export default function ImageUploadPage() {
	const dispatch = useAppDispatch();
	const [teamNumber, setTeamNumber] = useState<string>('');
	const [file, setFile] = useState<File>(null);
	const loadStatus: LoadStatus = useAppSelector(state => state.upload.loadStatus);
	const errorMessage: string = useAppSelector(state => state.upload.error);

	useEffect(
		() => {
			if (loadStatus === LoadStatus.success) {
				console.log('resetting');
				setTeamNumber('');
				setFile(null);
			}
		},
		[loadStatus]
	);

	const handleErrorToastClose = (event, reason): void => {
		if (reason === 'clickaway') {
			return;
		}

		dispatch(clearUploadError());
	};

	const isFileTooLarge: boolean = file?.size >= FILE_SIZE_LIMIT;

	return (
		<div className="image-upload-page">
			<Snackbar
				open={ !!errorMessage }
				autoHideDuration={ 6000 }
				onClose={ handleErrorToastClose }
				message={ errorMessage }
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
					{ errorMessage }
				</Alert>
			</Snackbar>
			<TextField
				id="team-number"
				variant="outlined"
				margin="normal"
				type="number"
				placeholder="0000"
				label="Team number"
				value={ teamNumber }
				onChange={ (event) => setTeamNumber(event.target.value) }
				InputProps={{
					startAdornment: <InputAdornment position="start">#</InputAdornment>
				}}
				inputProps={{
					min: 0,
					max: 9999,
					maxLength: 4
				}}
			/>
			<ImagePicker
				label="Choose image"
				helperText={ UploadErrors.fileTooLarge }
				isError={ isFileTooLarge }
				file={ file }
				setFile={ setFile }
			/>
			<Button
				color="primary"
				variant="contained"
				disabled={ teamNumber.length === 0 || !file || isFileTooLarge }
				onClick={ () => dispatch(uploadImage(file, teamNumber)) }
			>
				Upload Image
			</Button>
		</div>
	);
}
