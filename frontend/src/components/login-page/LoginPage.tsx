import './LoginPage.scss';
import React from 'react';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { AppState } from '../../models';
import { translate } from '../../service/TranslateService';
import { login } from '../../state';

const inputs = (state: AppState) => ({
	initialTeamNumber: state.login.teamNumber ?? '',
	initialEventCode: state.login.eventCode ?? '',
	initialSecretCode: state.login.secretCode ?? '',
	initialUsername: state.login.username ?? ''
});

const outputs = (dispatch) => ({
	login: (teamNumber, username, eventCode, secretCode) => dispatch(login(teamNumber, username, eventCode, secretCode))
});

class ConnectedLoginPage extends React.Component<any, any> {

	constructor(props) {
		super(props);

		this.state = {
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
			Number(this.state.teamNumber),
			this.state.username,
			this.state.eventCode,
			this.state.secretCode
		);
	};

	isValid = (): boolean => {
		return Boolean(this.state.teamNumber && this.state.username && this.state.eventCode && this.state.secretCode);
	};

	render() {
		return (
			<div className="login-page">
				<div className="content-wrapper">
					<form className="login-page-form" onSubmit={this.handleSubmit}>
						<Typography variant="h4">{ this.props.translate('SIGN_IN') }</Typography>
						<TextField
							id="team-number-input"
							label={this.props.translate('YOUR_TEAM_NUMBER')}
							name="teamNumber"
							type="number"
							margin="dense"
							variant="outlined"
							value={this.state.teamNumber}
							onChange={this.handleChange}
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
							label={this.props.translate('USERNAME')}
							name="username"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.username}
							onChange={this.handleChange}
							inputProps={{
								maxLength: 32
							}}
							autoComplete="section-login username"
						/>
						<TextField
							id="event-code-input"
							label={this.props.translate('EVENT_CODE')}
							name="eventCode"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.eventCode}
							onChange={this.handleChange}
							inputProps={{
								maxLength: 32
							}}
							autoComplete="off"
						/>
						<TextField
							id="secret-code-input"
							label={this.props.translate('SECRET_CODE')}
							name="secretCode"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.secretCode}
							onChange={this.handleChange}
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
							onClick={this.handleSubmit}
							disabled={!this.isValid()}
						>
							{ this.props.translate('SIGN_IN') }
						</Button>
					</form>
				</div>
			</div>
		);
	}
}

const LoginPage = connect(inputs, outputs)(ConnectedLoginPage);
export default translate(LoginPage);
