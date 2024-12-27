import './EventSelectorForm.scss';
import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Statelet } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { useAppSelector } from '../../../state';
import { IEventInfo } from '@gearscout/models';

interface IProps {
	selectEvent: (event: IEventInfo) => void;
}

export default function EventSelectorForm(props: IProps) {
	const translate = useTranslator();
	const [gameYear, setGameYear]: Statelet<string> = useState((new Date()).getFullYear().toString());
	const [eventCode, setEventCode]: Statelet<string> = useState<string>('');
	const [secretCode, setSecretCode]: Statelet<string> = useState<string>('');
	const teamNumber: number = useAppSelector(state => state.loginV2.user.teamNumber);

	const handleEventSubmission = (event): void => {
		event.preventDefault();

		const selectedEvent: IEventInfo = {
			teamNumber: teamNumber,
			gameYear: Number(gameYear),
			eventCode: eventCode,
			secretCode: secretCode,
			matchCount: null,
			inspectionCount: null
		};

		props.selectEvent(selectedEvent);
	};

	const isValid: boolean = eventCode.length > 0 && secretCode.length > 0;

	return (
		<form className="event-selector-form" onSubmit={ handleEventSubmission }>
			<TextField
				id="game-year-input"
				label={ translate('GAME_YEAR') }
				name="gameYear"
				type="number"
				margin="dense"
				size="small"
				variant="outlined"
				value={ gameYear }
				onChange={ (event) => setGameYear(event.target.value) }
				inputProps={{
					min: 1995,
					max: 2099
				}}
				autoComplete="off"
			/>
			<TextField
				id="event-code-input"
				label={ translate('EVENT_CODE') }
				name="eventCode"
				type="text"
				margin="dense"
				variant="outlined"
				value={ eventCode }
				onChange={ (event) => setEventCode(event.target.value) }
				inputProps={ {
					maxLength: 32
				} }
				autoComplete="off"
			/>
			<TextField
				id="secret-code-input"
				label={ translate('SECRET_CODE') }
				name="secretCode"
				type="text"
				margin="dense"
				variant="outlined"
				value={ secretCode }
				onChange={ (event) => setSecretCode(event.target.value) }
				inputProps={ {
					maxLength: 32
				} }
				autoComplete="off"
			/>
			<Button
				id="event-selector-form__submit-button"
				variant="contained"
				color="primary"
				type="submit"
				onClick={ handleEventSubmission }
				disabled={ !isValid }
			>
				{ translate('LOAD_EVENT') }
			</Button>
		</form>
	);
}
