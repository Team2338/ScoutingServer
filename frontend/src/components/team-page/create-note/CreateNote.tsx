import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fab,
	InputAdornment,
	TextField,
	Tooltip
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useTranslator } from '../../../service/TranslateService';


interface IProps {
	isMobile: boolean;
	selectedTeamNum: number;
	createNote: (robotNum: number, content: string) => void;
}

export default function CreateNote(props: IProps) {

	const [isOpen, setOpen] = useState<boolean>(false);
	const [robotNum, setRobotNum] = useState<string>('');
	const [noteContent, setNoteContent] = useState<string>('');
	const translate = useTranslator();

	const handleOpen = () => {
		const selectedTeamNum = props.selectedTeamNum ?? '';
		setRobotNum('' + selectedTeamNum);
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
		setRobotNum('');
		setNoteContent('');
	};

	const handleSubmit = () => {
		setOpen(false);

		const convertedRobotNum = Number.parseInt(robotNum);
		props.createNote(convertedRobotNum, noteContent);

		setRobotNum('');
		setNoteContent('');
	};

	const isValid = (): boolean => {
		return !!robotNum && !!noteContent;
	};

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
						id="team-number"
						variant="outlined"
						margin="normal"
						type="number"
						placeholder={ translate('TEAM_NUMBER') }
						label={ translate('TEAM_NUMBER') }
						value={robotNum}
						onChange={(event) => setRobotNum(event.target.value)}
						InputProps={{
							startAdornment: <InputAdornment position="start">#</InputAdornment>
						}}
						inputProps={{
							min: 0,
							max: 9999
						}}
					/>
					<TextField
						id="note-content"
						variant="outlined"
						margin="normal"
						placeholder={ translate('NOTE') }
						label={ translate('NOTE') }
						value={noteContent}
						helperText={`${noteContent.length}/1024`}
						onChange={(event) => setNoteContent(event.target.value)}
						multiline={true}
						fullWidth={true}
						inputProps={{
							maxLength: 1024
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						onClick={handleCancel}
					>
						{ translate('CANCEL') }
					</Button>
					<Button
						color="primary"
						onClick={handleSubmit}
						disabled={!isValid()}
					>
						{ translate('SUBMIT') }
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);

}
