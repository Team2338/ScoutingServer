import './LoginPage.scss';
import { Button, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../state/Actions';


const outputs = (dispatch) => ({
	login: (teamNumber, eventCode, secretCode) => dispatch(login(teamNumber, eventCode, secretCode))
})

class ConnectedLoginPage extends React.Component<any, any> {

	constructor(props) {
		super(props);

		this.state = {
			teamNumber: '',
			eventCode: '',
			secretCode: ''
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
			this.state.teamNumber,
			this.state.eventCode,
			this.state.secretCode
		);
	}

	render() {
		return (
			<div className="login-page">
				<form className="login-page-form" onSubmit={this.handleSubmit}>
					<Typography>Login</Typography>
					<TextField
						label="Your Team Number"
						name="teamNumber"
						type="text"
						margin="dense"
						value={this.state.teamNumber}
						onChange={this.handleChange}
					/>
					<TextField
						label="Event Code"
						name="eventCode"
						type="text"
						margin="dense"
						value={this.state.eventCode}
						onChange={this.handleChange}
					/>
					<TextField
						label="Secret Code"
						name="secretCode"
						type="text"
						margin="dense"
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
		);
	}
}

const LoginPage = connect(null, outputs)(ConnectedLoginPage);
export default LoginPage;
