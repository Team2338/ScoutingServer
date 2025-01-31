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

export default function RobotWeightInput(props: IProps) {
	return (
		<TextField
			id="robot-weight-input"
			label="Robot weight"
			name="robotWeight"
			type="number"
			margin="normal"
			variant="outlined"
			value={ props.value }
			onChange={ event => props.onChange(event.target.value) }
			slotProps={{
				input: {
					startAdornment: <InputAdornment position="start"><Icon>scale</Icon></InputAdornment>,
					endAdornment: <InputAdornment position="end">lbs</InputAdornment>
				},
				htmlInput: {
					min: 0,
					max: 9999
				}
			}}
			autoComplete="off"
		/>
	);
}
