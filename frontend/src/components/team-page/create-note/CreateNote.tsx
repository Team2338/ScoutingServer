import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, InputAdornment, TextField, Tooltip } from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import React from 'react';
import { useTranslator } from '../../../service/TranslateService';


interface IProps {
	isMobile: boolean;
	selectedTeamNum: number;
	createNote: (teamNum: number, content: string) => void;
}

export default function CreateNote(props: IProps) {

	const [isOpen, setOpen] = React.useState(false);
	const [teamNum, setTeamNum] = React.useState('');
	const [noteContent, setNoteContent] = React.useState('');
	const translate = useTranslator();

	const handleOpen = () => {
		const selectedTeamNum = props.selectedTeamNum ?? '';
		setTeamNum('' + selectedTeamNum);
		setOpen(true);
	}

	const handleCancel = () => {
		setOpen(false);
		setTeamNum('');
		setNoteContent('');
	};

	const handleSubmit = () => {
		setOpen(false);

		const convertedTeamNum = Number.parseInt(teamNum);
		props.createNote(convertedTeamNum, noteContent);

		setTeamNum('');
		setNoteContent('');
	}

	return (
		<React.Fragment>
			<Tooltip title={ translate('ADD_NOTE') }>
				<Fab
					id="team-page-add-note"
					color="primary"
					aria-label={ translate('ADD_NOTE') }
					onClick={handleOpen}
				>
					<NoteAddIcon/>
				</Fab>
			</Tooltip>
			<Dialog
				id="create-note"
				open={isOpen}
				onClose={handleCancel}
				aria-labelledby="create-note-form-title"
			>
				<DialogTitle
					id="create-note-form-title"
				>
					{ translate('ADD_NOTE') }
				</DialogTitle>
				<DialogContent>
					<TextField
						variant="outlined"
						margin="normal"
						type="number"
						placeholder={ translate('TEAM_NUMBER') }
						label={ translate('TEAM_NUMBER') }
						value={teamNum}
						onChange={(event) => setTeamNum(event.target.value)}
						InputProps={{
							startAdornment: <InputAdornment position="start">#</InputAdornment>
						}}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						placeholder={ translate('NOTE') }
						label={ translate('NOTE') }
						value={noteContent}
						onChange={(event) => setNoteContent(event.target.value)}
						multiline={true}
						fullWidth={true}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCancel}
					>
						{ translate('CANCEL') }
					</Button>
					<Button
						onClick={handleSubmit}
					>
						{ translate('SUBMIT') }
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);

}
