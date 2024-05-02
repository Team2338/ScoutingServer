import React from 'react';
import './EventPage.scss';
import { useTranslator } from '../../service/TranslateService';

export default function EventPage() {

	// TODO: get list of events
	const translate = useTranslator();
	const events = [
		{
			eventCode: 'Midwest',
			secretCode: 'secret',
			year: 2024
		},
		{
			eventCode: 'CIR',
			secretCode: 'secret',
			year: 2024
		},
		{
			eventCode: 'Champs',
			secretCode: 'secret',
			year: 2024
		}
	];

	const eventListItems = events.map((event) => (
		<li key={event.eventCode}>
			{ event.eventCode }
		</li>
	));

	return (
		<main className="page event-page">
			<h1>{ translate('SELECT_AN_EVENT') }</h1>
			<ul className="event-list">
				{ eventListItems }
			</ul>
		</main>
	);
}
