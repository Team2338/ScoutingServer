import './App.css';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../models/states.model';
import { initApp } from '../state/Effects';
import Header from './header/Header';
import LoginPage from './login-page/LoginPage';
import ManagePage from './manage-page/ManagePage';


const select = (state: AppState) => ({
	teamNumber: state.teamNumber,
	eventCode: state.eventCode
});

const outputs = (dispatch) => ({
	initApp: () => dispatch(initApp())
});


class ConnectedApp extends React.Component<any, any> {

	componentDidMount() {
		this.props.initApp();
	}

	render() {
		const page = this.props.teamNumber
			? <ManagePage />
			: <LoginPage />;

		return (
			<React.Fragment>
				<Header teamNumber={this.props.teamNumber} eventCode={this.props.eventCode} />
				{ page }
			</React.Fragment>
		);
	}

}

const App = connect(select, outputs)(ConnectedApp);
export default App;
