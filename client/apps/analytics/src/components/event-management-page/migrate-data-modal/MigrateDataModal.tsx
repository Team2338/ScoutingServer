import './MigrateDataModal.scss';
import { useState } from 'react';
import { useTranslator } from '../../../service/TranslateService';
import { useAppDispatch, useAppSelector } from '../../../state';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { IEventInfo } from '@gearscout/shared-models';

interface IProps {
	isOpen: boolean;
	handleClose: () => void;
	eventToMigrate: IEventInfo;
}

export default function MigrateDataModal(props: IProps) {
	const translate = useTranslator();
	const dispatch = useAppDispatch();

	const selectedEvent = useAppSelector(state => state.events.selectedEvent);
	const [eventCode, setEventCode] = useState<string>('');
	const [secretCode, setSecretCode] = useState<string>('');
	const [gameYear, setGameYear] = useState<string>('');

	const isCorrectInfo = (eventCode === selectedEvent.eventCode)
		&& (secretCode === selectedEvent.secretCode)
		&& (Number.parseInt(gameYear) === selectedEvent.gameYear);

	const handleConfirmation = () => {
		console.log('Confirmed!');
		// TODO: dispatch data migration action
		setEventCode('');
		setSecretCode('');
		setGameYear('');
		props.handleClose();
	};

	const handleCancel = () => {
		console.log('Canceled!');
		setEventCode('');
		setSecretCode('');
		setGameYear('');
		props.handleClose();
	};

	return (
		<Dialog className="migrate-data-modal" open={ props.isOpen } onClose={ handleCancel }>
			<DialogTitle>{ translate('ARE_YOU_SURE' )}</DialogTitle>
			<DialogContent>
				<div className="modal-content">
					<div className="prompt">
						{ translate('DATA_MIGRATION_DESCRIPTION') }
					</div>
					<div className="prompt">
						{ translate('DATA_MIGRATION_PROMPT') }
					</div>
					<TextField
						id="event-code-input"
						name="eventCode"
						label={ translate('EVENT_CODE' )}
						margin="dense"
						variant="outlined"
						autoComplete="off"
						value={ eventCode }
						onChange={ event => setEventCode(event.target.value) }
					/>
					<TextField
						id="secret-code-input"
						name="secretCode"
						label={ translate('SECRET_CODE') }
						margin="dense"
						variant="outlined"
						autoComplete="off"
						value={ secretCode }
						onChange={ event => setSecretCode(event.target.value) }
					/>
					<TextField
						id="game-year-input"
						name="gameYear"
						label={ translate('GAME_YEAR') }
						type="text"
						inputMode="numeric"
						margin="dense"
						variant="outlined"
						autoComplete="off"
						value={ gameYear }
						onChange={ event => setGameYear(event.target.value) }
						slotProps={{
							htmlInput: {
								pattern: '[0-9]*'
							}
						}}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={ handleCancel }
				>
					{ translate('NO') }
				</Button>
				<Button
					variant="contained"
					disabled={ !isCorrectInfo }
					disableElevation={ true }
					onClick={ handleConfirmation }
				>
					{ translate('YES') }
				</Button>
			</DialogActions>
		</Dialog>
	);
}
