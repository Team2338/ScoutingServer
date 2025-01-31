import '../InspectionForm.scss';
import React from 'react';
import {
	InputAdornment,
	TextField,
} from '@mui/material';
import { AltRoute } from '@mui/icons-material';

interface IProps {
	value: string;
	onChange: (value: string) => void;
}

export default function AutoPathsInput(props: IProps) {
	return (
		<TextField
			id="auto-paths"
			name="AutoPaths"
			multiline={ true }
			margin="normal"
			autoComplete="off"
			label="Describe auto paths"
			value={ props.value }
			slotProps={{
				input: {
					startAdornment: <InputAdornment position="start"><AltRoute>route</AltRoute></InputAdornment>
				},
				htmlInput: {
					maxLength: 1024
				}
			}}
			onChange={ (event) => props.onChange(event.target.value) }
		/>
	);
}
