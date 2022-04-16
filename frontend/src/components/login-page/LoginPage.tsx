import './LoginPage.scss';
import { Button, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';
import { translate } from '../../service/TranslateService';
import { login } from '../../state/Effects';

const inputs = (state: AppState) => ({
	initialTeamNumber: state.teamNumber ?? '',
	initialEventCode: state.eventCode ?? '',
	initialSecretCode: state.secretCode ?? '',
	initialUsername: state.username ?? ''
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
	}

	handleSubmit = (event) => {
		event.preventDefault();

		this.props.login(
			Number(this.state.teamNumber),
			this.state.username,
			this.state.eventCode,
			this.state.secretCode
		);
	}

	isValid = (): boolean => {
		return this.state.teamNumber && this.state.username && this.state.eventCode && this.state.secretCode;
	}

	render() {
		return (
			<div className="login-page">
				<div className="content-wrapper">
					<form className="login-page-form" onSubmit={this.handleSubmit}>
						<Typography variant="h4">{ this.props.translate('SIGN_IN') }</Typography>
						<TextField
							label={this.props.translate('YOUR_TEAM_NUMBER')}
							name="teamNumber"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.teamNumber}
							onChange={this.handleChange}
						/>
						<TextField
							label={this.props.translate('USERNAME')}
							name="username"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.username}
							onChange={this.handleChange}
						/>
						<TextField
							label={this.props.translate('EVENT_CODE')}
							name="eventCode"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.eventCode}
							onChange={this.handleChange}
						/>
						<TextField
							label={this.props.translate('SECRET_CODE')}
							name="secretCode"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.secretCode}
							onChange={this.handleChange}
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
