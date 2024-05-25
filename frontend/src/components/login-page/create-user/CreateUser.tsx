import './CreateUser.scss';
import React, { useState } from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useTranslator } from '../../../service/TranslateService';
import { LoginPageVariant, Statelet } from '../../../models';
import { AppDispatch, createUser, useAppDispatch } from '../../../state';

interface IProps {
	handlePageRedirect: (variant: LoginPageVariant) => void;
}

export default function CreateUser(props: IProps) {

	const translate = useTranslator();
	const dispatch: AppDispatch = useAppDispatch();
	const [email, setEmail]: Statelet<string> = useState('');
	const [password, setPassword]: Statelet<string> = useState('');
	const [teamNumber, setTeamNumber]: Statelet<string> = useState('');
	const [username, setUsername]: Statelet<string> = useState('');

	const isValid: boolean = Boolean(
		email
		&& password.length >= 8
		&& teamNumber
		// && Number.isInteger(teamNumber)
		&& username
	);

	const handleSubmit = (event): void => {
		event.preventDefault();

		if (!isValid) return;

		dispatch(createUser({
			email: email,
			password: password,
			teamNumber: Number(teamNumber),
			username: username
		}));
	};

	return (
		<form
			className="create-user-form"
			aria-labelledby="title"
			onSubmit={ handleSubmit }
		>
			<h1 className="title" id="title">{ translate('CREATE_USER') }</h1>
			<TextField
				id="email"
				label={ translate('EMAIL') }
				name="email"
				type="email"
				margin="dense"
				variant="outlined"
				value={ email }
				onChange={ (event) => setEmail(event.target.value) }
				autoComplete="off"
				autoFocus={ true }
			/>
			<TextField
				id="password"
				label={ translate('PASSWORD') }
				name="password"
				type="password"
				margin="dense"
				variant="outlined"
				value={ password }
				onChange={ (event) => setPassword(event.target.value) }
				inputProps={ {
					maxLength: 32,
					minLength: 8
				} }
				autoComplete="off"
			/>
			<TextField
				id="team-number"
				label={ translate('TEAM_NUMBER') }
				name="teamNumber"
				type="number"
				margin="dense"
				variant="outlined"
				value={ teamNumber }
				onChange={ (event) => setTeamNumber(event.target.value) }
				InputProps={ {
					startAdornment: <InputAdornment position="start">#</InputAdornment>
				} }
				inputProps={ {
					min: 0,
					max: 9999
				} }
				autoComplete="off"
			/>
			<TextField
				id="username"
				label={ translate('USERNAME') }
				name="username"
				type="username"
				margin="dense"
				variant="outlined"
				value={ username }
				onChange={ (event) => setUsername(event.target.value) }
				inputProps={ {
					maxLength: 32
				} }
			/>
			<Button
				className="create-user-form-submit"
				variant="contained"
				color="primary"
				type="submit"
				onClick={ handleSubmit }
				disabled={ !isValid }
			>
				{ translate('CREATE_USER') }
			</Button>
			<section className="link-section">
				<span
					className="login-page__variant-link"
					onClick={ () => props.handlePageRedirect(LoginPageVariant.guestPage) }
				>
					{ translate('GUEST_SIGN_IN') } &gt;
				</span>
				<span
					className="login-page__variant-link"
					onClick={ () => props.handlePageRedirect(LoginPageVariant.loginPage) }
				>
					{ translate('MEMBER_SIGN_IN') } &gt;
				</span>
			</section>
		</form>
	);
}
