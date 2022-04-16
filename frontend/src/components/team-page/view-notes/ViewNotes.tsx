import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@material-ui/core';
import NotesIcon from '@material-ui/icons/Notes';
import React from 'react';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	isMobile: boolean;
}

export default function ViewNotes(props: IProps) {

	const [isOpen, setOpen] = React.useState(false);
	const translate = useTranslator();

	const handleOpen = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<React.Fragment>
			<Tooltip title={ translate('VIEW_NOTES_FOR_THIS_TEAM')}>
				<Button
					id="view-notes-button"
					color="primary"
					variant="outlined"
					size="small"
					startIcon={<NotesIcon fontSize="small"/>}
					onClick={handleOpen}
					disableElevation
				>
					{ translate('NOTES') }
				</Button>
			</Tooltip>
			<Dialog
				open={isOpen}
				onClose={handleClose}
			>
				<DialogTitle id="view-notes-title">
					{ translate('VIEW_NOTES') }
				</DialogTitle>
				<DialogContent>

				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						onClick={handleClose}
					>
						{ translate('CLOSE') }
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);

}
