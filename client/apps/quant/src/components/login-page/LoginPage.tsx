import './LoginPage.scss';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { ICredentials } from '../../models/models';


const initialState: ICredentials = {
	teamNumber: '',
	scouterName: '',
	eventCode: '',
	secretCode: '',
	tbaCode: ''
};

interface IProps {
	handleSubmit: (credentials: ICredentials) => void;
}

export default function LoginPage(props: IProps) {
	const [credentials, setCredentials] = useState<ICredentials>(initialState);

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setCredentials(prev => ({
			...prev,
			[event.target.name]: event.target.value
		}));
	};

	const isValid = Boolean(
		credentials.teamNumber
		&& credentials.scouterName
		&& credentials.eventCode
		&& credentials.secretCode
	);

	const handleSubmit = (event) => {
		event.preventDefault();
		for (const key in credentials) {
			localStorage.setItem(key, credentials[key]);
		}
		props.handleSubmit(credentials);
	};

	// Attempt to read credentials from query parameters
	// then attempt to recall from localStorage
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const initialTeamNumber = query.get('team');
		const initialEventCode = query.get('event');
		const initialSecretCode = query.get('secret');
		const initialTbaCode = query.get('tba');

		if (initialTeamNumber ?? initialEventCode ?? initialSecretCode ?? initialTbaCode) {
			// Set initial values from query string and clear
			if (initialTeamNumber) {
				localStorage.setItem('teamNumber', initialTeamNumber);
			}
			if (initialEventCode) {
				localStorage.setItem('eventCode', initialEventCode);
			}
			if (initialSecretCode) {
				localStorage.setItem('secretCode', initialSecretCode);
			}
			if (initialTbaCode) {
				localStorage.setItem('tbaCode', initialTbaCode);
			}
			const urlPieces: string[] = [window.location.protocol, '//', window.location.host, window.location.pathname];
			const url: string = urlPieces.join('');
			window.location.replace(url);
		}

		setCredentials({
			teamNumber: localStorage.getItem('teamNumber') ?? '',
			scouterName: localStorage.getItem('scouterName') ?? '',
			eventCode: localStorage.getItem('eventCode') ?? '',
			secretCode: localStorage.getItem('secretCode') ?? '',
			tbaCode: localStorage.getItem('tbaCode') ?? ''
		});
	}, []);

	return (
		<main className="page login-page">
			<h1 className="app-title">GearScout</h1>
			<div className="version">v2026.2</div>
			<form className="login-form">
				<h2 className="login-form__title">Sign in</h2>
				<TextField
					id="team-number-input"
					label="Team number"
					name="teamNumber"
					type="text"
					inputMode="numeric"
					margin="dense"
					variant="outlined"
					value={ credentials.teamNumber }
					onChange={ handleChange }
					slotProps={{
						input: {
							startAdornment: <InputAdornment className="adornment" position="start">#</InputAdornment>
						},
						htmlInput: {
							minLength: 1,
							maxLength: 5,
							pattern: '[0-9]*'
						}
					}}
				/>
				<TextField
					id="scouter-name-input"
					label="Scouter name"
					name="scouterName"
					type="text"
					margin="dense"
					variant="outlined"
					value={ credentials.scouterName }
					onChange={ handleChange }
					slotProps={{
						htmlInput: {
							maxLength: 32
						}
					}}
				/>
				<TextField
					id="event-code-input"
					label="Event code"
					name="eventCode"
					type="text"
					margin="dense"
					variant="outlined"
					value={ credentials.eventCode }
					onChange={ handleChange }
					slotProps={{
						htmlInput: {
							maxLength: 32
						}
					}}
				/>
				<TextField
					id="secret-code-input"
					label="Secret code"
					name="secretCode"
					type="text"
					margin="dense"
					variant="outlined"
					value={ credentials.secretCode }
					onChange={ handleChange }
					slotProps={{
						htmlInput: {
							maxLength: 32
						}
					}}
				/>
				<TextField
					id="tba-code-input"
					label="TBA code"
					name="tbaCode"
					type="text"
					margin="dense"
					variant="outlined"
					value={ credentials.tbaCode }
					onChange={ handleChange }
					slotProps={{
						htmlInput: {
							maxLength: 6
						}
					}}
				/>
				<button
					className="submit-button gif-button-primary"
					type="submit"
					onClick={ handleSubmit }
					disabled={ !isValid }
				>
					Submit
				</button>
			</form>
		</main>
	);
}
