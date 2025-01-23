import { IEventInfo } from '@gearscout/models';
import { Button, TextField } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import styles from './EventSelectorForm.module.scss';

interface IProps {
	teamNumber: number;
	handleEventSelected: (event: IEventInfo) => void;
	translate: (key: string) => string;
}

const inputProps = {
	htmlInput: {
		maxLength: 32,
		required: true,
	}
};

export function EventSelectorForm(props: IProps) {
	const [gameYear, setGameYear] = useState<string>((new Date()).getFullYear().toString());
	const [eventCode, setEventCode] = useState<string>('');
	const [secretCode, setSecretCode] = useState<string>('');

	const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();

		if (!isValid) {
			return;
		}

		props.handleEventSelected({
			gameYear: Number(gameYear),
			eventCode: eventCode.trim(),
			secretCode: secretCode.trim(),
			teamNumber: props.teamNumber,
			matchCount: null,
			inspectionCount: null
		});
	};

	const isValid: boolean =
		gameYear.length > 0
		&& eventCode.length > 0
		&& secretCode.length > 0;

	return (
		<form className={ styles.eventSelectorForm } onSubmit={ handleSubmit }>
			<TextField
				id={ styles.gameYearInput }
				label={ props.translate('GAME_YEAR') }
				name="gameYear"
				type="number"
				margin="dense"
				size="small"
				variant="outlined"
				value={ gameYear }
				onChange={ (event) => setGameYear(event.target.value) }
				slotProps={{
					htmlInput: {
						min: 1995,
						max: 2099
					}
				}}
				autoComplete="off"
			/>
			<TextField
				id={ styles.eventCodeInput }
				label={ props.translate('EVENT_CODE') }
				name="eventCode"
				type="text"
				margin="dense"
				variant="outlined"
				value={ eventCode }
				onChange={ (event) => setEventCode(event.target.value) }
				slotProps={ inputProps }
				autoComplete="off"
			/>
			<TextField
				id={ styles.secretCodeInput }
				label={ props.translate('SECRET_CODE') }
				name="secretCode"
				type="text"
				margin="dense"
				variant="outlined"
				value={ secretCode }
				onChange={ (event) => setSecretCode(event.target.value) }
				slotProps={ inputProps }
				autoComplete="off"
			/>
			<Button
				id={ styles.submitButton }
				variant="contained"
				color="primary"
				type="submit"
				disabled={ !isValid }
			>
				{ props.translate('LOAD_EVENT') }
			</Button>
		</form>
	);
}
