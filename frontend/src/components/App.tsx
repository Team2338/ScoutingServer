import './App.css';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../models/states.model';
import { initApp } from '../state/Effects';
import AnalyzePage from './analyze-page/AnalyzePage';
import Header from './header/Header';
import LoginPage from './login-page/LoginPage';
import ManagePage from './manage-page/ManagePage';
import { Route, Routes } from 'react-router-dom';


const select = (state: AppState) => ({
	isLoggedIn: state.isLoggedIn,
});

const outputs = (dispatch) => ({
	initApp: () => dispatch(initApp())
});


class ConnectedApp extends React.Component<any, any> {

	componentDidMount() {
		this.props.initApp();
	}

	render() {
		if (!this.props.isLoggedIn) {
			return (
				<React.Fragment>
					<Header />
					<LoginPage />
				</React.Fragment>
			);
		}

		const managePage = <ManagePage />

		return (
			<React.Fragment>
				<Header />
				<Routes>
					<Route path="/" element={managePage} />
					<Route path="/manage" element={managePage} />
					<Route path="/analyze" element={<AnalyzePage />} />
				</Routes>
			</React.Fragment>
		);
	}

}

const App = connect(select, outputs)(ConnectedApp);
export default App;
