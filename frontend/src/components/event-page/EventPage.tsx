import React from 'react';
import './EventPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { EventInfo } from '../../models';
import { AppDispatch, selectEvent, useAppDispatch } from '../../state';

export default function EventPage() {

	// TODO: get list of events
	const translate = useTranslator();
	const dispatch: AppDispatch = useAppDispatch();

	const _selectEvent = (event: EventInfo) => dispatch(selectEvent(event));

	const events: EventInfo[] = [
		{
			teamNumber: 2338,
			gameYear: 2024,
			eventCode: 'Midwest',
			secretCode: 'secret',
			matchCount: 400
		},
		{
			teamNumber: 2338,
			gameYear: 2024,
			eventCode: 'CIR',
			secretCode: 'secret',
			matchCount: 350
		},
		{
			teamNumber: 2338,
			gameYear: 2024,
			eventCode: 'Champs',
			secretCode: 'secret',
			matchCount: 1400
		}
	];

	const eventListItems = events.map((event) => (
		<li
			key={ event.gameYear + '\0' + event.eventCode + '\0' + event.secretCode }
			className="event-list-item"
			onClick={ () => _selectEvent(event) }
		>
			<div>{ event.eventCode } <span>({ event.matchCount })</span></div>
			<div>********</div>
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
