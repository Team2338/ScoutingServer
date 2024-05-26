import React, { useEffect } from 'react';
import './EventPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { EventInfo, LoadStatus } from '../../models';
import { AppDispatch, getEvents, selectEvent, useAppDispatch, useAppSelector } from '../../state';
import DataFailure from '../shared/data-failure/DataFailure';

export default function EventPage() {

	const translate = useTranslator();
	const dispatch: AppDispatch = useAppDispatch();
	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: EventInfo[] = useAppSelector(state => state.events.events);
	const _selectEvent = (event: EventInfo) => dispatch(selectEvent(event));

	useEffect(
		() => {
			dispatch(getEvents())
				.catch((reason) => {
					// TODO: proper error handling; maybe fall back to manual event entry
					alert('Failed to get the list of events!\n');
					console.error('Failed to get the list of events', reason);
				});
		},
		[dispatch]
	);

	if (eventLoadStatus === LoadStatus.none || eventLoadStatus === LoadStatus.loading) {
		return (
			<main className="page event-page">
				{ translate('LOADING') }
			</main>
		);
	}

	if (eventLoadStatus === LoadStatus.failed) {
		// TODO: Should default to manual event entry
		return (
			<main className="page event-page event-page-failed">
				<DataFailure messageKey="FAILED_TO_LOAD_EVENTS" />
			</main>
		);
	}

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
			<div className="event-list-wrapper">
				<h1 className="event-list-header">{ translate('SELECT_AN_EVENT') }</h1>
				<ol className="event-list">
					{ eventListItems }
				</ol>
			</div>
		</main>
	);
}
