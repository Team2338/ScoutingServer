import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { AppState } from '../models';
import { initApp } from '../state';
import './App.scss';
import Header from './header/Header';
import LoginPage from './login-page/LoginPage';
import ManagePage from './manage-page/ManagePage';
import PlanningPage from './planning-page/PlanningPage';
import StatPage from './stat-page/StatPage';
import TeamPage from './team-page/TeamPage';


const select = (state: AppState) => ({
	isLoggedIn: state.login.isLoggedIn,
});

const outputs = (dispatch) => ({
	initApp: () => dispatch(initApp())
});


class ConnectedApp extends React.Component<any, null> {

	componentDidMount(): void {
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

		const managePage = <ManagePage />;
		const teamPage = <TeamPage />;
		const statPage = <StatPage />;
		const planningPage = <PlanningPage />;

		return (
			<React.Fragment>
				<Header />
				<Routes>
					<Route path="/" element={ managePage } />
					<Route path="/matches" element={ managePage } />
					<Route path="/teams" element={ teamPage } />
					<Route path="/stats" element={ statPage } />
					<Route path="/plan" element={ planningPage } />
				</Routes>
			</React.Fragment>
		);
	}

}

const App = connect(select, outputs)(ConnectedApp);
export default App;
