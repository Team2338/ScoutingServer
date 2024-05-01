import React, { useState } from 'react';
import './MemberLoginForm.scss';
import { AppDispatch, loginAsMember, useAppDispatch } from '../../../state';
import { Statelet } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { Button, TextField } from '@mui/material';

export default function MemberLoginForm() {
	const translate = useTranslator();
	const dispatch: AppDispatch = useAppDispatch();
	const [email, setEmail]: Statelet<string> = useState('');
	const [password, setPassword]: Statelet<string> = useState('');

	const isValid: boolean = Boolean(email && password);

	const handleSubmit = (event): void => {
		event.preventDefault();
		if (!isValid) return;

		dispatch(loginAsMember(email, password))
			.catch((e: Error) => alert(e.message));
	};

	return (
		<form
			className="member-login-form"
			aria-labelledby="title"
			onSubmit={ handleSubmit }
		>
			<h1 className="title" id="title">{ translate('Sign in') }</h1>
			<TextField
				id="email"
				label={ translate('EMAIL') }
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
				id="password"
				label={ translate('PASSWORD') }
				name="password"
				type="password"
				margin="dense"
				variant="outlined"
				value={ password }
				onChange={ (event) => setPassword(event.target.value) }
				inputProps={{
					maxLength: 32
				}}
			/>
			<Button
				className="member-login-form-submit"
				variant="contained"
				color="primary"
				type="submit"
				onClick={ handleSubmit }
				disabled={ !isValid }
			>
				{ translate('LOGIN') }
			</Button>
		</form>
	);
}
