import React, { useEffect } from 'react';
import './App.scss';
import { initApp, selectIsLoggedIn, useAppDispatch, useAppSelector } from '../state/';
import Header from './header/Header';
import MainPage from './main-page/MainPage';
import LoginPage from './login-page/LoginPage';
import { IEventInfo } from '../models';
import EventPage from './event-page/EventPage';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
	const dispatch = useAppDispatch();
	const isLoggedIn: boolean = useAppSelector(selectIsLoggedIn);
	const selectedEvent: IEventInfo = useAppSelector(state => state.events.selectedEvent);

	useEffect(
		() => {
			dispatch(initApp());
		},
		[dispatch]
	);

	if (!isLoggedIn) {
		return (
			<div className="App">
				<Header />
				<LoginPage />
			</div>
		);
	}

	if (!selectedEvent) {
		return (
			<div className="App">
				<Header />
				<EventPage />
			</div>
		);
	}

	return (
		<div className="App">
			<Header />
			<Routes>
				<Route path="/" element={ <MainPage /> } />
				<Route path="/events" element={ <EventPage /> } />

				{/*	Default: redirect to the home page */}
				<Route path="*" element={ <Navigate to="/" />} />
			</Routes>
		</div>
	);
}

export default App;