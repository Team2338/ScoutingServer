import React from 'react';
import './EventPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { EventInfo } from '../../models';

export default function EventPage() {

	// TODO: get list of events
	const translate = useTranslator();
	const events: EventInfo[] = [
		{
			gameYear: 2024,
			eventCode: 'Midwest',
			secretCode: 'secret',
			matchCount: 400
		},
		{
			gameYear: 2024,
			eventCode: 'CIR',
			secretCode: 'secret',
			matchCount: 350
		},
		{
			gameYear: 2024,
			eventCode: 'Champs',
			secretCode: 'secret',
			matchCount: 1400
		}
	];

	const eventListItems = events.map((event) => (
		<li key={ event.gameYear + '\0' + event.eventCode + '\0' + event.secretCode }>
			{ event.eventCode }
		</li>
	));

	return (
		<main className="page event-page">
			<h1>{ translate('SELECT_AN_EVENT') }</h1>
			<ol className="event-list">
				{ eventListItems }
			</ol>
		</main>
	);
}
