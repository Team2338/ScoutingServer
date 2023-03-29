import { Alert, Button, InputAdornment, Slide, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { login, useAppDispatch, useAppSelector } from '../../state';
import './LoginPage.scss';

export default function LoginPage() {

	const dispatch = useAppDispatch();
	const [teamNumber, setTeamNumber] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [eventCode, setEventCode] = useState<string>('');
	const [secretCode, setSecretCode] = useState<string>('');
	const [isErrorToastOpen, setErrorToastOpen] = useState<boolean>(false);
	const errorMessage: string = useAppSelector(state => state.login.error);

	useEffect(() => setErrorToastOpen(!!errorMessage), [errorMessage]);

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

		setErrorToastOpen(false);
	}

	return (
		<div className="login-page">
			<Snackbar
				open={isErrorToastOpen}
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

			<form className="login-form" onSubmit={handleSubmit}>
				<Typography variant="h4">Sign in</Typography>
				<TextField
					id="team-number-input"
					label="Your team number"
					name="teamNumber"
					type="number"
					margin="dense"
					variant="outlined"
					value={teamNumber}
					onChange={event => setTeamNumber(event.target.value)}
					InputProps={{
						startAdornment: <InputAdornment position="start">#</InputAdornment>
					}}
					inputProps={{
						min: 0,
						max: 9999
					}}
					autoComplete="off"
					autoFocus={true}
				/>
				<TextField
					id="username-input"
					label="Username"
					name="username"
					type="text"
					margin="dense"
					variant="outlined"
					value={username}
					onChange={event => setUsername(event.target.value)}
					inputProps={{
						maxLength: 32
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
					value={eventCode}
					onChange={event => setEventCode(event.target.value)}
					inputProps={{
						maxLength: 32
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
					value={secretCode}
					onChange={event => setSecretCode(event.target.value)}
					inputProps={{
						maxLength: 32
					}}
					autoComplete="off"
				/>
				<Button
					id="login-form-submit"
					variant="contained"
					color="primary"
					type="submit"
					onClick={handleSubmit}
					disabled={!isValid}
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
