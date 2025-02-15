import React, {
	Fragment,
	useEffect
} from 'react';
import './EventPage.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslator } from '../../service/TranslateService';
import { AppDispatch, getEvents, selectEvent, useAppDispatch, useAppSelector } from '../../state';
import { EventSelectorForm, EventSelectorList } from '@gearscout/components';
import {
	IEventInfo,
	LoadStatus,
	UserRole
} from '@gearscout/models';

export default function EventPage() {

	const translate = useTranslator();
	const navigate = useNavigate();
	const dispatch: AppDispatch = useAppDispatch();
	const teamNumber: number = useAppSelector(state => state.loginV2.user.teamNumber);
	const userRole: UserRole = useAppSelector(state => state.loginV2.role);
	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.events);
	const _selectEvent = async (event: IEventInfo) => {
		await dispatch(selectEvent(event));
		navigate('/matches');
	};

	const _loadEvents = () => {
		dispatch(getEvents());
	};

	useEffect(
		() => {
			if (userRole === UserRole.admin || userRole === UserRole.superAdmin) {
				dispatch(getEvents());
			}
		},
		[dispatch, userRole]
	);

	return (
		<main className="page event-page">
			<div className="event-list-wrapper">
				<h1 className="event-list-header">{ translate('SELECT_AN_EVENT') }</h1>
				<EventSelectorForm
					teamNumber={ teamNumber }
					selectEvent={ _selectEvent }
					translate={ translate }
				/>
			</div>
			{ (userRole === UserRole.admin || userRole === UserRole.superAdmin) &&
				<Fragment>
					<div className="event-section-separator">&minus; or &minus;</div>
					<div className="event-list-wrapper">
						<h1 className="event-list-header">{ translate('SELECT_AN_EVENT') }</h1>
						<EventSelectorList
							events={ events }
							eventLoadStatus={ eventLoadStatus }
							handleEventSelected={ _selectEvent }
							handleRetry={ _loadEvents }
							translate={ translate }
						/>
					</div>
				</Fragment>
			}
		</main>
	);
}
