import './LoginPage.scss';
import { Button, TextField } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';
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

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	login = () => {
		this.props.login(
			this.state.teamNumber,
			this.state.eventCode,
			this.state.secretCode
		);
	}

	render() {
		return (
			<div className="login-page">
				<TextField
					name="teamNumber"
					placeholder="Your Team Number"
					value={this.state.teamNumber}
					onChange={this.onChange}
				/>
				<TextField
					name="eventCode"
					placeholder="Event Code"
					value={this.state.eventCode}
					onChange={this.onChange}
				/>
				<TextField
					name="secretCode"
					placeholder="Secret Code"
					value={this.state.secretCode}
					onChange={this.onChange}
				/>
				<Button
					variant="contained"
					onClick={this.login}
				>
					Login
				</Button>
			</div>
		);
	}
}

const LoginPage = connect(null, outputs)(ConnectedLoginPage);
export default LoginPage;
