import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { AppState, LoginStatus } from '../models';
import { initApp } from '../state';
import './App.scss';
import Header from './header/Header';
import LoginPage from './login-page/LoginPage';
import ManagePage from './manage-page/ManagePage';
import PlanningPage from './planning-page/PlanningPage';
import StatPage from './stat-page/StatPage';
import TeamPage from './team-page/TeamPage';
import InspectionPage from './inspection-page/InspectionPage';
import EventPage from './event-page/EventPage';


const select = (state: AppState) => ({
	isLoggedIn: state.loginV2.loginStatus === LoginStatus.loggedIn || state.loginV2.loginStatus === LoginStatus.guest,
	hasSelectedEvent: state.loginV2.selectedEvent
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

		if (!this.props.hasSelectedEvent) {
			return (
				<React.Fragment>
					<Header />
					<EventPage />
				</React.Fragment>
			);
		}

		const managePage = <ManagePage />;
		const teamPage = <TeamPage />;
		const statPage = <StatPage />;
		const planningPage = <PlanningPage />;
		const inspectionPage = <InspectionPage />;

		return (
			<React.Fragment>
				<Header />
				<Routes>
					<Route path="/" element={ managePage } />
					<Route path="/matches" element={ managePage } />
					<Route path="/teams" element={ teamPage } />
					<Route path="/stats" element={ statPage } />
					<Route path="/plan" element={ planningPage } />
					<Route path="/inspections" element={ inspectionPage } />
				</Routes>
			</React.Fragment>
		);
	}

}

const App = connect(select, outputs)(ConnectedApp);
export default App;
