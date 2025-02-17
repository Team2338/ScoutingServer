import React from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
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
	loginStatus: state.loginV2.loginStatus,
	hasSelectedEvent: state.events.selectedEvent
});

const outputs = (dispatch) => ({
	initApp: async () => dispatch(initApp())
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

		const isNotGuest: boolean = this.props.loginStatus === LoginStatus.loggedIn;

		const eventPage = <EventPage />;
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
					{ isNotGuest && <Route path="/events" element={ eventPage } /> }
					<Route path="/matches" element={ managePage } />
					<Route path="/teams" element={ teamPage } />
					<Route path="/stats" element={ statPage } />
					<Route path="/plan" element={ planningPage } />
					<Route path="/inspections" element={ inspectionPage } />

					{ /* Default: redirect to home page */ }
					<Route path="*" element={ <Navigate to="/" /> } />
				</Routes>
			</React.Fragment>
		);
	}

}

const App = connect(select, outputs)(ConnectedApp);
export default App;
