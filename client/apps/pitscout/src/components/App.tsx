import React, { useEffect } from 'react';
import './App.scss';
import { initApp, selectIsLoggedIn, useAppDispatch, useAppSelector } from '../state/';
import Header from './header/Header';
import MainPage from './main-page/MainPage';
import LoginPage from './login-page/LoginPage';
import EventPage from './event-page/EventPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IEventInfo } from '@gearscout/models';

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
				<UpdateBanner />
				<LoginPage />
			</div>
		);
	}

	if (!selectedEvent) {
		return (
			<div className="App">
				<Header />
				<UpdateBanner />
				<EventPage />
			</div>
		);
	}

	return (
		<div className="App">
			<Header />
			<UpdateBanner />
			<Routes>
				<Route path="/" element={ <MainPage /> } />
				<Route path="/events" element={ <EventPage /> } />

				{/*	Default: redirect to the home page */}
				<Route path="*" element={ <Navigate to="/" />} />
			</Routes>
		</div>
	);
}

function UpdateBanner() {
	const appHasUpdateAvailable: boolean = useAppSelector(state => state.serviceWorker.updated);
	const serviceWorker: ServiceWorker = useAppSelector(state => state.serviceWorker.sw);

	return appHasUpdateAvailable && (
		<div className="update-available-banner">
			<span>An update is available!</span>
			<button
				className="update-button"
				onClick={ () => {
					serviceWorker.postMessage('SKIP_WAITING');
				}}
			>
				Update
			</button>
		</div>
	);
}

export default App;
