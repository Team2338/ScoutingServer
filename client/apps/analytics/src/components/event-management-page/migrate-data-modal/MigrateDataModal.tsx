import { useState } from 'react';
import { useTranslator } from '../../../service/TranslateService';
import { useAppDispatch, useAppSelector } from '../../../state';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
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
		props.handleClose();
	};

	const handleCancel = () => {
		console.log('Canceled!');
		props.handleClose();
	};

	return (
		<Dialog open={ props.isOpen } onClose={ handleCancel }>
			<DialogTitle>{ translate('ARE_YOU_SURE' )}</DialogTitle>
			<DialogContentText>
				This will migrate all of the data from the target event into this one.
				The target event will be removed once all data has been transferred.
				Please enter the information for your currently selected event
				to confirm that you wish to perform this migration.
			</DialogContentText>
			<DialogContent>
				<TextField
					name="eventCode"
					placeholder={ translate('EVENT_CODE' )}
					margin="dense"
					variant="outlined"
					autoComplete="off"
					value={ eventCode }
					onChange={ event => setEventCode(event.target.value) }
				/>
				<TextField
					name="secretCode"
					placeholder={ translate('SECRET_CODE') }
					margin="dense"
					variant="outlined"
					autoComplete="off"
					value={ secretCode }
					onChange={ event => setSecretCode(event.target.value) }
				/>
				<TextField
					name="gameYear"
					placeholder={ translate('GAME_YEAR') }
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
