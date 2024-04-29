import './LoginPage.scss';
import React from 'react';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { AppState } from '../../models';
import { translate } from '../../service/TranslateService';
import { login } from '../../state';
import CreateUser from './create-user/CreateUser';

const inputs = (state: AppState) => ({
	initialGameYear: state.login.gameYear ?? '',
	initialTeamNumber: state.login.teamNumber ?? '',
	initialEventCode: state.login.eventCode ?? '',
	initialSecretCode: state.login.secretCode ?? '',
	initialUsername: state.login.username ?? ''
});

const outputs = (dispatch) => ({
	login: (
		gameYear,
		teamNumber,
		username,
		eventCode,
		secretCode
	) => dispatch(login({
		gameYear,
		teamNumber,
		username,
		eventCode,
		secretCode
	}))
});

enum LoginPageVariant {
	guestPage = 'guestPage',
	loginPage = 'loginPage',
	createUserPage = 'createUserPage',
}

class ConnectedLoginPage extends React.Component<any, any> {

	constructor(props) {
		super(props);

		this.state = {
			variant: LoginPageVariant.createUserPage,
			gameYear: props.initialGameYear,
			teamNumber: props.initialTeamNumber,
			username: props.initialUsername,
			eventCode: props.initialEventCode,
			secretCode: props.initialSecretCode
		};
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();

		this.props.login(
			Number(this.state.gameYear),
			Number(this.state.teamNumber),
			this.state.username,
			this.state.eventCode,
			this.state.secretCode
		);
	};

	isValid = (): boolean => {
		return Boolean(
			this.state.gameYear
			&& this.state.teamNumber
			&& this.state.username
			&& this.state.eventCode
			&& this.state.secretCode
		);
	};

	render() {
		if (this.state.variant === LoginPageVariant.createUserPage) {
			return (
				<main className="login-page">
					<div className="content-wrapper">
						<CreateUser />
					</div>
				</main>
			);
		}

		return (
			<main className="login-page">
				<div className="content-wrapper">
					<form className="login-page-form" onSubmit={ this.handleSubmit }>
						<div className="login-page-title-row">
							<Typography variant="h4">{ this.props.translate('SIGN_IN') }</Typography>
							<TextField
								id="game-year-input"
								label={ this.props.translate('GAME_YEAR') }
								name="gameYear"
								type="number"
								margin="dense"
								size="small"
								variant="outlined"
								value={ this.state.gameYear }
								onChange={ this.handleChange }
								inputProps={{
									min: 1995,
									max: 2099
								}}
								autoComplete="off"
							/>
						</div>
						<TextField
							id="team-number-input"
							label={ this.props.translate('YOUR_TEAM_NUMBER') }
							name="teamNumber"
							type="number"
							margin="dense"
							variant="outlined"
							value={ this.state.teamNumber }
							onChange={ this.handleChange }
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
							label={ this.props.translate('USERNAME') }
							name="username"
							type="text"
							margin="dense"
							variant="outlined"
							value={ this.state.username }
							onChange={ this.handleChange }
							inputProps={{
								maxLength: 32
							}}
							autoComplete="section-login username"
						/>
						<TextField
							id="event-code-input"
							label={ this.props.translate('EVENT_CODE') }
							name="eventCode"
							type="text"
							margin="dense"
							variant="outlined"
							value={ this.state.eventCode }
							onChange={ this.handleChange }
							inputProps={{
								maxLength: 32
							}}
							autoComplete="off"
						/>
						<TextField
							id="secret-code-input"
							label={ this.props.translate('SECRET_CODE') }
							name="secretCode"
							type="text"
							margin="dense"
							variant="outlined"
							value={ this.state.secretCode }
							onChange={ this.handleChange }
							inputProps={{
								maxLength: 32
							}}
							autoComplete="off"
						/>
						<Button
							className="login-page-form-submit"
							variant="contained"
							color="primary"
							type="submit"
							onClick={ this.handleSubmit }
							disabled={ !this.isValid() }
						>
							{ this.props.translate('SIGN_IN') }
						</Button>
					</form>
				</div>
			</main>
		);
	}
}

const LoginPage = translate(connect(inputs, outputs)(ConnectedLoginPage));
export default LoginPage;
