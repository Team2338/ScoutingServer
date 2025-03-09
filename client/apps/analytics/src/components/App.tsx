import { UserRole } from '@gearscout/models';
import React, { Fragment } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppState, LoginStatus } from '../models';
import { AppDispatch, initApp } from '../state';
import './App.scss';
import Header from './header/Header';
import LoginPage from './login-page/LoginPage';
import MatchPage from './match-page/MatchPage';
import PlanningPage from './planning-page/PlanningPage';
import StatPage from './stat-page/StatPage';
import TeamPage from './team-page/TeamPage';
import InspectionPage from './inspection-page/InspectionPage';
import EventPage from './event-page/EventPage';
import UserManagementPage from './user-management-page/UserManagementPage';


const select = (state: AppState) => ({
	isLoggedIn: state.loginV2.loginStatus === LoginStatus.loggedIn || state.loginV2.loginStatus === LoginStatus.guest,
	loginStatus: state.loginV2.loginStatus,
	userRole: state.loginV2.role,
	hasSelectedEvent: state.events.selectedEvent
});

const outputs = (dispatch: AppDispatch) => ({
	initApp: async () => dispatch(initApp())
});

const connector = connect(select, outputs);
type IProps = ConnectedProps<typeof connector>;


class ConnectedApp extends React.Component<IProps, null> {

	componentDidMount(): void {
		this.props.initApp();
	}

	render() {
		if (!this.props.isLoggedIn) {
			return (
				<Fragment>
					<Header />
					<LoginPage />
				</Fragment>
			);
		}

		if (!this.props.hasSelectedEvent) {
			return (
				<Fragment>
					<Header />
					<EventPage />
				</Fragment>
			);
		}

		const isNotGuest: boolean = this.props.loginStatus === LoginStatus.loggedIn;
		const isAdmin: boolean = this.props.userRole === UserRole.superAdmin || this.props.userRole === UserRole.admin;

		const eventPage = <EventPage />;
		const managePage = <MatchPage />;
		const teamPage = <TeamPage />;
		const statPage = <StatPage />;
		const planningPage = <PlanningPage />;
		const inspectionPage = <InspectionPage />;
		const userManagementPage = <UserManagementPage />;

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
					{ isAdmin && <Route path="/user-management" element={ userManagementPage } /> }

					{ /* Default: redirect to home page */ }
					<Route path="*" element={ <Navigate to="/" /> } />
				</Routes>
			</React.Fragment>
		);
	}

}

const App = connector(ConnectedApp);
export default App;
