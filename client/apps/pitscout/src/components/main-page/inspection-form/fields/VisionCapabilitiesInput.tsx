import '../InspectionForm.scss';
import React from 'react';
import {
	InputAdornment,
	TextField
} from '@mui/material';
import { Camera } from '@mui/icons-material';

interface IProps {
	value: string;
	onChange: (value: string) => void;
}

export default function VisionCapabilitiesInput(props: IProps) {
	return (
		<TextField
			id="vision-capabilities"
			name="VisionCapabilities"
			multiline={ true }
			margin="normal"
			autoComplete="off"
			label="Vision capabilities"
			value={ props.value }
			slotProps={{
				input: {
					startAdornment: <InputAdornment position="start"><Camera/></InputAdornment>
				},
				htmlInput: {
					maxLength: 1024
				}
			}}
			onChange={ (event) => props.onChange(event.target.value) }
		/>
	);
}
