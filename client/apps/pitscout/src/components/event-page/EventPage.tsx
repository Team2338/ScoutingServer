import { getEvents, selectEvent, useAppDispatch, useAppSelector } from '../../state';
import { IEventInfo, IUserInfo, LoadStatus } from '../../models';
import { Button, Skeleton, TextField } from '@mui/material';
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import './EventPage.scss';
import { useNavigate } from 'react-router-dom';

const inputProps = {
	htmlInput: {
		maxLength: 32,
		required: true,
		pattern: /.*\S.*/
	}
};

export default function EventPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const user: IUserInfo = useAppSelector(state => state.loginv2.user);
	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.list);

	const [eventCode, setEventCode] = useState<string>('');
	const [secretCode, setSecretCode] = useState<string>('');

	const _getEvents = () => dispatch(getEvents());
	const _selectEvent = async (event: IEventInfo) => {
		await dispatch(selectEvent(event));
		navigate('/');
	};
	const manuallySelectEvent = () => {
		_selectEvent({
			gameYear: new Date().getFullYear(),
			eventCode: eventCode.trim(),
			secretCode: secretCode.trim(),
			teamNumber: user.teamNumber,
			matchCount: null,
			inspectionCount: null
		});
	};

	useEffect(
		() => {
			_getEvents();
		},
		[dispatch]
	);

	const loadingList = () => {
		return (
			<ol className="event-list">
				{ new Array(8).fill(0).map((_, index: number) => (
					<li key={index} className="event-list-item">
						<Skeleton
							variant="rounded"
							width={ '100%' }
							height={ 56 }
						/>
					</li>
				))
				}
			</ol>
		);
	};

	const actualEventList = () => {
		return (
			<ol className="event-list">
				{
					events
						.filter((event: IEventInfo) => event.gameYear === new Date().getFullYear())
						.map((event: IEventInfo, index: number) => (
							<li key={ index } className="event-list-item">
								<button onClick={ () => _selectEvent(event) }>
									<span className="event-code-label">{ event.eventCode }</span>
									<span className="inspection-count">{ event.inspectionCount ?? 0 } Inspections</span>
									<span className="secret-code-label">{ event.secretCode }</span>
									<span className="match-count">{ event.matchCount ?? 0 } Matches</span>
								</button>
							</li>
						))
				}
			</ol>
		);
	};

	const failedList = () => {
		return (
			<Fragment>
				<div>Failed to load events</div>
				<Button onClick={_getEvents}>Retry</Button>
			</Fragment>
		);
	};

	const EventList = () => {
		switch (eventLoadStatus) {
			case LoadStatus.loadingWithPriorSuccess: // Fallthrough
			case LoadStatus.failedWithPriorSuccess: // Fallthrough
			case LoadStatus.success:
				return actualEventList();
			case LoadStatus.failed:
				return failedList();
			default:
				return loadingList();
		}
	};

	return (
		<main className="page event-page">
			<section className="event-input-section">
				<h2 className="event-section-header">Manually enter event</h2>
				<TextField
					id="event-code-input"
					label="Event code"
					name="eventCode"
					type="text"
					margin="dense"
					variant="outlined"
					value={ eventCode }
					onChange={ (event: ChangeEvent<HTMLInputElement>) => setEventCode(event.target.value) }
					slotProps={ inputProps }
					autoComplete="off"
				/>
				<TextField
					id="secret-code-input"
					label="Secret code"
					name="secretCode"
					type="text"
					margin="dense"
					variant="outlined"
					value={ secretCode }
					onChange={ (event: ChangeEvent<HTMLInputElement>) => setSecretCode(event.target.value) }
					slotProps={ inputProps }
					autoComplete="off"
				/>
				<Button
					className="event-input-submit-button"
					variant="contained"
					onClick={ manuallySelectEvent }
					disabled={ eventCode.trim() === '' || secretCode.trim() === '' }
				>
					Confirm
				</Button>
			</section>
			<div className="event-section-separator">&minus; or &minus;</div>
			<section className="event-list-section">
				<h2 className="event-section-header">Choose existing event</h2>
				<EventList />
			</section>
		</main>
	);
}
