import { login, useAppDispatch, useAppSelector } from '../../state';
import React, { useState } from 'react';
import { Alert, Button, Snackbar, TextField, Typography } from '@mui/material';
import './LoginPage.scss';
import { clearLoginError } from '@gearscout/state';

export default function LoginPage() {
	const dispatch = useAppDispatch();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const errorMessage: string = useAppSelector(state => state.login.error);

	const isValid: boolean = Boolean(email && password);

	const handleSubmit = (event): void => {
		event.preventDefault();
		dispatch(login(email, password));
	};

	const handleErrorToastClose = (_event, reason: string): void => {
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
					id="email-input"
					label="Email"
					name="email"
					type="email"
					margin="dense"
					variant="outlined"
					value={ email }
					onChange={ (event) => setEmail(event.target.value) }
					autoComplete="on"
					autoFocus={ true }
				/>
				<TextField
					id="password-input"
					label="Password"
					name="password"
					type="password"
					margin="dense"
					variant="outlined"
					value={ password }
					onChange={ (event) => setPassword(event.target.value) }
					slotProps={{
						htmlInput: {
							maxLength: 32
						}
					}}
				/>
				<Button
					className="login-form-submit"
					variant="contained"
					color="primary"
					type="submit"
					onClick={ handleSubmit }
					disabled={ !isValid }
				>
					Sign in
				</Button>
			</form>
		</div>
	);

}
