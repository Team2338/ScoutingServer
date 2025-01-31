import '../InspectionForm.scss';
import {
	Icon,
	InputAdornment,
	TextField
} from '@mui/material';
import React from 'react';

interface IProps {
	value: string;
	onChange: (value: string) => void;
}

export default function RobotNotesInput(props: IProps) {
	return (
		<TextField
			id="robot-notes"
			name="RobotNotes"
			margin="normal"
			multiline={ true }
			autoComplete="off"
			label="Notes on robot"
			value={ props.value }
			slotProps={{
				input: {
					startAdornment:
						<InputAdornment position="start"><Icon>note_alt</Icon></InputAdornment>
				},
				htmlInput: {
					maxLength: 1024
				}
			}}
			onChange={ (event) => props.onChange(event.target.value) }
		/>
	);
}
