import { selectEvent, useAppDispatch, useAppSelector } from '../../state';
import { IEventInfo, IUserInfo, LoadStatus } from '../../models';
import { Button, Skeleton } from '@mui/material';
import React, { useState } from 'react';

export default function EventPage() {
	const dispatch = useAppDispatch();
	const user: IUserInfo = useAppSelector(state => state.loginv2.user);
	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.list);

	const [eventCode, setEventCode] = useState<string>('');
	const [secretCode, setSecretCode] = useState<string>('');

	const _selectEvent = async (event: IEventInfo) => {
		await dispatch(selectEvent(event));
	};
	const manuallySelectEvent = () => {
		_selectEvent({
			gameYear: new Date().getFullYear(),
			eventCode: eventCode.trim(),
			secretCode: secretCode.trim(),
			teamNumber: user.teamNumber
		});
	};

	if (eventLoadStatus === LoadStatus.none || eventLoadStatus === LoadStatus.loading) {
		return (
			<main className="page event-page">
				<section className="event-input-section">
					<h2 className="event-section-header">Manually enter event</h2>
					<input placeholder="event code"/>
					<input placeholder="secret code"/>
					<Button
						variant="contained"
						onClick={manuallySelectEvent}
						disabled={eventCode.trim() === '' || secretCode.trim() === ''}
					>
						Confirm
					</Button>
				</section>
				<div className="event-section-separator">-- or --</div>
				<section className="event-list-section">
					<h2 className="event-section-header">Choose existing event</h2>
					{ new Array(8).map((_, index: number) => <Skeleton key={ index }/>) }
				</section>
			</main>
		);
	}


}
