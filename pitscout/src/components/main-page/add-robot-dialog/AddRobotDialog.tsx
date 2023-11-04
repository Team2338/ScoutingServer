import React, { useState } from 'react';
import './AddRobotDialog.scss';
import { createForm, useAppDispatch } from '../../../state';
import { Statelet } from '../../../models';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface IProps {
	open: boolean;
	handleClose: () => void;
	handleSubmit: (num: number) => void;
}

export default function AddRobotDialog(props: IProps) {
	const dispatch = useAppDispatch();
	const [robotNumber, setRobotNumber]: Statelet<string> = useState('');

	const actualHandleSubmit = (): void => {
		const robonum: number = Number(robotNumber);
		dispatch(createForm(robonum));
		setRobotNumber('');
		props.handleSubmit(robonum);
	};

	return (
		<Dialog open={ props.open } onClose={ props.handleClose }>
			<DialogTitle>Add robot</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="robotNumber"
					label="Robot number"
					type="number"
					variant="outlined"
					value={ robotNumber }
					onChange={ (event) => setRobotNumber(event.target.value) }
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={ props.handleClose }>Cancel</Button>
				<Button
					disabled={ robotNumber === '' }
					onClick={ actualHandleSubmit }
				>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
}
