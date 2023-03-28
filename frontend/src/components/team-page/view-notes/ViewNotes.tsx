import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { LoadStatus, Note } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { useAppSelector } from '../../../state/Hooks';
import './ViewNotes.scss';

interface IProps {
	robotNumber: number;
	notes: Note[];
}

export default function ViewNotes(props: IProps) {

	const [isOpen, setOpen] = useState(false);
	const translate = useTranslator();

	const imageState = useAppSelector(state => state.images[props.robotNumber]);

	const handleOpen = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	}

	let image = null;
	switch (imageState?.loadStatus) {
		case undefined: // Fallthrough
		case LoadStatus.none:
			break;
		case LoadStatus.failed:
			image = <div>Failed to load image</div>; // TODO: translate
			break;
		case LoadStatus.loading:
			image = <div>{ translate('LOADING') }</div>
			break;
		case LoadStatus.success:
		case LoadStatus.loadingWithPriorSuccess: // Fallthrough
		case LoadStatus.failedWithPriorSuccess: // Fallthrough
			if (imageState.info.present) {
				image = <img src={imageState.url} alt={`Robot of ${props.robotNumber}`} />; // TODO: translate
				break;
			}
			break;
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
					disabled={props.notes.length === 0}
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
					{ image }
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
