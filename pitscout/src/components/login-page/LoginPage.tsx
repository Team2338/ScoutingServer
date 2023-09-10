import { Alert, Button, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { AppDispatch, clearLoginError, login, useAppDispatch, useAppSelector } from '../../state';
import './LoginPage.scss';
import { Statelet } from '../../models';

export default function LoginPage() {

	const dispatch: AppDispatch = useAppDispatch();
	const [teamNumber, setTeamNumber]: Statelet<string> = useState<string>('');
	const [username, setUsername]: Statelet<string> = useState<string>('');
	const [eventCode, setEventCode]: Statelet<string> = useState<string>('');
	const [secretCode, setSecretCode]: Statelet<string> = useState<string>('');
	const errorMessage: string = useAppSelector(state => state.login.error);

	const isValid: boolean = (
		teamNumber.length > 0
		&& eventCode.length > 0
		&& secretCode.length > 0
		&& username.length > 0
	);

	const handleSubmit = (event): void => {
		event.preventDefault();
		dispatch(login({
			teamNumber: teamNumber,
			username: username,
			eventCode: eventCode,
			secretCode: secretCode
		}));
	};

	const handleErrorToastClose = (event, reason): void => {
		if (reason === 'clickaway') {
			return;
		}

		dispatch(clearLoginError());
	};

	return (
		<div className="login-page">
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

			<form className="login-form" onSubmit={ handleSubmit }>
				<Typography variant="h4">Sign in</Typography>
				<TextField
					id="team-number-input"
					label="Your team number"
					name="teamNumber"
					type="number"
					margin="dense"
					variant="outlined"
					value={ teamNumber }
					onChange={ event => setTeamNumber(event.target.value) }
					InputProps={{
						startAdornment: <InputAdornment position="start">#</InputAdornment>
					}}
					inputProps={{
						min: 0,
						max: 9999
					}}
					autoComplete="off"
					autoFocus={ true }
				/>
				<TextField
					id="username-input"
					label="Username"
					name="username"
					type="text"
					margin="dense"
					variant="outlined"
					value={ username }
					onChange={ event => setUsername(event.target.value) }
					inputProps={{
						maxlength: 32
					}}
					autoComplete="section-login username"
				/>
				<TextField
					id="event-code-input"
					label="Event code"
					name="eventCode"
					type="text"
					margin="dense"
					variant="outlined"
					value={ eventCode }
					onChange={ event => setEventCode(event.target.value) }
					inputProps={{
						maxlength: 32
					}}
					autoComplete="off"
				/>
				<TextField
					id="secret-code-input"
					label="Secret code"
					name="secretCode"
					type="text"
					margin="dense"
					variant="outlined"
					value={ secretCode }
					onChange={ event => setSecretCode(event.target.value) }
					inputProps={{
						maxlength: 32
					}}
					autoComplete="off"
				/>
				<Button
					id="login-form-submit"
					variant="contained"
					color="primary"
					type="submit"
					onClick={ handleSubmit }
					disabled={ !isValid }
					sx={{
						marginTop: '8px'
					}}
				>
					Sign in
				</Button>
			</form>
		</div>
	);
}
