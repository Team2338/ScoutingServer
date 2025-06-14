import styles from './EventSelectorForm.module.scss';
import { IEventInfo } from '@gearscout/models';
import { Button, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';

interface IProps {
	teamNumber: number;
	selectEvent: (event: IEventInfo) => void;
	translate: (key: string) => string;
}

const textSlotProps = {
	htmlInput: {
		maxLength: 32,
		required: true,
	}
};

export const EventSelectorForm = (props: IProps) => {

	const [gameYear, setGameYear] = useState<string>(() => (new Date()).getFullYear().toString());
	const [eventCode, setEventCode] = useState<string>('');
	const [secretCode, setSecretCode] = useState<string>('');
	const hasFormError: boolean = (
		eventCode.length === 0
		|| secretCode.length === 0
		|| gameYear.length === 0
	);

	const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();

		if (hasFormError) {
			return;
		}

		props.selectEvent({
			eventId: null,
			teamNumber: props.teamNumber,
			gameYear: Number(gameYear),
			eventCode: eventCode,
			secretCode: secretCode,
			matchCount: null,
			inspectionCount: null
		});
	};


	return (
		<form className={ styles.eventSelectorForm } onSubmit={ handleSubmit }>
			<TextField
				id="game-year-input"
				label={ props.translate('GAME_YEAR') }
				name="gameYear"
				type="text"
				inputMode="numeric"
				margin="dense"
				size="small"
				variant="outlined"
				autoComplete="off"
				value={ gameYear }
				onChange={ (event) => setGameYear(event.target.value) }
			/>
			<TextField
				id="event-code-input"
				label={ props.translate('EVENT_CODE') }
				name="eventCode"
				type="text"
				margin="dense"
				variant="outlined"
				autoComplete="off"
				value={ eventCode }
				onChange={ (event) => setEventCode(event.target.value) }
				slotProps={ textSlotProps }
			/>
			<TextField
				id="secret-code-input"
				label={ props.translate('SECRET_CODE') }
				name="secretCode"
				type="text"
				margin="dense"
				variant="outlined"
				autoComplete="off"
				value={ secretCode }
				onChange={ (event) => setSecretCode(event.target.value) }
				slotProps={ textSlotProps }
			/>
			<Button
				id={ styles.test }
				variant="contained"
				color="primary"
				type="submit"
				disabled={ hasFormError }
			>
				{ props.translate('LOAD_EVENT') }
			</Button>
		</form>
	);
};
