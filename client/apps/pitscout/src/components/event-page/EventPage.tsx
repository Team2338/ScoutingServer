import { getEvents, selectEvent, useAppDispatch, useAppSelector } from '../../state';
import React, { useEffect } from 'react';
import './EventPage.scss';
import { useNavigate } from 'react-router-dom';
import { IEventInfo, IUserInfo, LoadStatus } from '@gearscout/models';
import { EventSelectorForm, EventSelectorList } from '@gearscout/components';
import { useTranslator } from '../../services/TranslateService';


export default function EventPage() {
	const translate = useTranslator();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const user: IUserInfo = useAppSelector(state => state.login.user);
	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.list);

	const _getEvents = () => dispatch(getEvents());
	const _selectEvent = async (event: IEventInfo) => {
		await dispatch(selectEvent(event));
		navigate('/');
	};

	useEffect(
		() => {
			_getEvents();
		},
		[dispatch]
	);


	return (
		<main className="page event-page">
			<section className="event-input-section">
				<h2 className="event-section-header">Manually enter event</h2>
				<EventSelectorForm
					teamNumber={ user.teamNumber }
					selectEvent={ _selectEvent }
					translate={ translate }
				/>
			</section>
			<div className="event-section-separator">&minus; or &minus;</div>
			<section className="event-list-section">
				<h2 className="event-section-header">Choose existing event</h2>
				<EventSelectorList
					events={ events }
					eventLoadStatus={ eventLoadStatus }
					handleEventSelected={ _selectEvent }
					handleRetry={ _getEvents }
					translate={ translate }
				/>
			</section>
		</main>
	);
}
