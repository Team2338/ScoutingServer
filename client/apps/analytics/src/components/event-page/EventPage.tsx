import React, { useEffect } from 'react';
import './EventPage.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslator } from '../../service/TranslateService';
import { AppDispatch, getEvents, selectEvent, useAppDispatch, useAppSelector } from '../../state';
import DataFailure from '../shared/data-failure/DataFailure';
import EventSelectorForm from './event-selector-form/EventSelectorForm';
import EventSelectorList from './event-selector-list/EventSelectorList';
import {
	IEventInfo,
	LoadStatus,
	UserRole
} from '@gearscout/models';

export default function EventPage() {

	const translate = useTranslator();
	const navigate = useNavigate();
	const dispatch: AppDispatch = useAppDispatch();
	const userRole: UserRole = useAppSelector(state => state.loginV2.role);
	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.events);
	const _selectEvent = async (event: IEventInfo) => {
		await dispatch(selectEvent(event));
		navigate('/matches');
	};

	useEffect(
		() => {
			if (userRole === UserRole.admin || userRole === UserRole.superAdmin) {
				dispatch(getEvents())
					.catch((reason) => {
						// TODO: proper error handling; maybe fall back to manual event entry
						alert('Failed to get the list of events!\n');
						console.error('Failed to get the list of events', reason);
					});
			}
		},
		[dispatch, userRole]
	);

	if (userRole !== UserRole.admin && userRole !== UserRole.superAdmin) {
		return (
			<main className="page event-page">
				<div className="event-list-wrapper">
					<h1 className="event-list-header">{ translate('SELECT_AN_EVENT') }</h1>
					<EventSelectorForm selectEvent={ _selectEvent } />
				</div>
			</main>
		);
	}

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

	return (
		<main className="page event-page">
			<div className="event-list-wrapper">
				<h1 className="event-list-header">{ translate('SELECT_AN_EVENT') }</h1>
				<EventSelectorList events={ events } selectEvent={ _selectEvent } />
			</div>
		</main>
	);
}
