import './LoginPage.scss';
import React, { ChangeEvent, useState } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';

interface IState {
	teamNumber: string;
	scouterName: string;
	eventCode: string;
	secretCode: string;
	tbaCode: string;
}

const initialState: IState = {
	teamNumber: '',
	scouterName: '',
	eventCode: '',
	secretCode: '',
	tbaCode: ''
};

interface IProps {
	handleSubmit: (credentials: IState) => void;
}

export default function LoginPage(props: IProps) {
	const [state, setState] = useState<IState>(initialState);
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setState(prev => ({
			...prev,
			[event.target.name]: event.target.value
		}));
	};

	const isValid = Boolean(
		state.teamNumber
		&& state.scouterName
		&& state.eventCode
		&& state.secretCode
	);

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
					value={ state.teamNumber }
					onChange={ handleChange }
					slotProps={{
						input: {
							startAdornment: <InputAdornment position="start">#</InputAdornment>
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
					value={ state.scouterName }
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
					value={ state.eventCode }
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
					value={ state.secretCode }
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
					value={ state.eventCode }
					onChange={ handleChange }
					slotProps={{
						htmlInput: {
							maxLength: 6
						}
					}}
				/>
				<Button
					className="submit-button"
					variant="contained"
					color="primary"
					type="submit"
					onClick={ () => props.handleSubmit(state) }
					disabled={ !isValid }
				>
					Submit
				</Button>
			</form>
		</main>
	);
}
