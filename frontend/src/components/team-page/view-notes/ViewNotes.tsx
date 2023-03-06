import './ViewNotes.scss';
import React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Icon,
	Tooltip
} from '@mui/material';
import { Note } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	isMobile: boolean;
	notes: Note[];
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

	const noteElements = props.notes.map((note: Note) => (
		<div className="team-note" key={note.id}>
			<div className="team-note-content">
				{note.content}
			</div>
			<div className="team-note-author">
				{note.creator}
			</div>
		</div>
	))

	return (
		<React.Fragment>
			<Tooltip title={ translate('VIEW_NOTES_FOR_THIS_TEAM')}>
				<Button
					id="view-notes-button"
					color="primary"
					variant="outlined"
					size="small"
					startIcon={<Icon fontSize="small">notes</Icon>}
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
					{ translate('NOTES') }
				</DialogTitle>
				<DialogContent>
					<div className="team-notes-list">
						{ noteElements }
					</div>
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
