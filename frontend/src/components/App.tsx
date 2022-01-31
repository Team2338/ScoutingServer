import './App.css';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../models/states.model';
import Header from './header/Header';
import ManagePage from './manage-page/ManagePage';


const select = (state: AppState) => ({
	teamNumber: state.teamNumber,
	eventCode: state.eventCode
});

const outputs = (dispatch) => ({
});


class ConnectedApp extends React.Component<any, any> {

	render() {
		return (
			<React.Fragment>
				<Header teamNumber={this.props.teamNumber} eventCode={this.props.eventCode} />
				<ManagePage />
			</React.Fragment>
		);
	}

}

const App = connect(select, outputs)(ConnectedApp);
export default App;
