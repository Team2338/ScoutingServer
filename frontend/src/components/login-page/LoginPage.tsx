import './LoginPage.scss';
import { Button, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';
import { login } from '../../state/Effects';

const inputs = (state: AppState) => ({
	initialTeamNumber: state.teamNumber ?? '',
	initialEventCode: state.eventCode ?? '',
	initialSecretCode: state.secretCode ?? ''
});

const outputs = (dispatch) => ({
	login: (teamNumber, eventCode, secretCode) => dispatch(login(teamNumber, eventCode, secretCode))
});

class ConnectedLoginPage extends React.Component<any, any> {

	constructor(props) {
		super(props);

		this.state = {
			teamNumber: props.initialTeamNumber,
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
			this.state.eventCode,
			this.state.secretCode
		);
	}

	render() {
		return (
			<div className="login-page">
				<div className="content-wrapper">
					<form className="login-page-form" onSubmit={this.handleSubmit}>
						<Typography variant="h4">Login</Typography>
						<TextField
							label="Your team number"
							name="teamNumber"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.teamNumber}
							onChange={this.handleChange}
						/>
						<TextField
							label="Event code"
							name="eventCode"
							type="text"
							margin="dense"
							variant="outlined"
							value={this.state.eventCode}
							onChange={this.handleChange}
						/>
						<TextField
							label="Secret code"
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
						>
							Login
						</Button>
					</form>
				</div>
			</div>
		);
	}
}

const LoginPage = connect(inputs, outputs)(ConnectedLoginPage);
export default LoginPage;
