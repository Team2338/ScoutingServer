import React, { useState } from 'react';
import './MemberLoginForm.scss';
import '../LoginPage.scss';
import { AppDispatch, loginAsMember, useAppDispatch } from '../../../state';
import { LoginPageVariant, Statelet } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { Button, TextField } from '@mui/material';

interface IProps {
	handlePageRedirect: (variant: LoginPageVariant) => void;
}

export default function MemberLoginForm(props: IProps) {
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
			<h1 className="title" id="title">{ translate('SIGN_IN') }</h1>
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
				inputProps={ {
					maxLength: 32
				} }
			/>
			<Button
				className="member-login-form-submit"
				variant="contained"
				color="primary"
				type="submit"
				onClick={ handleSubmit }
				disabled={ !isValid }
			>
				{ translate('SIGN_IN') }
			</Button>
			<section className="link-section">
				<span
					className="login-page__variant-link"
					onClick={ () => props.handlePageRedirect(LoginPageVariant.guestPage) }
				>
					{ translate('GUEST_LOGIN') } &gt;
				</span>
				<span
					className="login-page__variant-link"
					onClick={ () => props.handlePageRedirect(LoginPageVariant.createUserPage) }
				>
					{ translate('CREATE_ACCOUNT') } &gt;
				</span>
			</section>
		</form>
	);
}
