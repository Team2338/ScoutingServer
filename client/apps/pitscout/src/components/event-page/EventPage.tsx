import { getEvents, selectEvent, useAppDispatch, useAppSelector } from '../../state';
import { Button, TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import './EventPage.scss';
import { useNavigate } from 'react-router-dom';
import { IEventInfo, IUserInfo, LoadStatus } from '@gearscout/models';
import { EventSelectorList } from '@gearscout/components';
import { useTranslator } from '../../services/TranslateService';

const inputProps = {
	htmlInput: {
		maxLength: 32,
		required: true,
		pattern: /.*\S.*/
	}
};

export default function EventPage() {
	const translate = useTranslator();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const user: IUserInfo = useAppSelector(state => state.login.user);
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
