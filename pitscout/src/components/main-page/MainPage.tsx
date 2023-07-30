import React, { useState } from 'react';
import './MainPage.scss';
import { createForm, selectForm, useAppDispatch, useAppSelector } from '../../state';
import DetailNoteForm from './detail-note-form/DetailNoteForm';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export default function MainPage() {

	const dispatch = useAppDispatch();
	const robotNumbers: number[] = useAppSelector(state => state.forms.robots);
	const selectedRobot: number = useAppSelector(state => state.forms.selected?.robotNumber);
	const [isModalOpen, setModalOpen] = useState<boolean>(false);

	const listOptions = robotNumbers.map((robot: number) => (
		<div
			className="robot-list-item"
			key={ robot }
			onClick={ () => dispatch(selectForm(robot)) }
		>
			<div className="robot-list-item__number">{ robot }</div>
		</div>
	));

	const detailSection = !!selectedRobot
		? <DetailNoteForm/>
		: <div>Pick or add a robot number!</div>

	return (
		<div className="main-page">
			<div className="robot-list">
				<Button
					id="robot-list-add"
					variant="text"
					onClick={ () => setModalOpen(true) }
				>
					(+) Add robot
				</Button>
				{ listOptions }
			</div>
			{ detailSection }
			<AddRobotDialog
				open={isModalOpen}
				handleClose={() => setModalOpen(false)}
				handleSubmit={(robotNumber: number) => {
					dispatch(selectForm(robotNumber))
					setModalOpen(false);
				}}
			/>
		</div>
	);
}

interface IRobotDialogProps {
	open: boolean;
	handleClose: () => void;
	handleSubmit: (num: number) => void;
}
function AddRobotDialog(props: IRobotDialogProps) {
	const dispatch = useAppDispatch();
	const [robotNumber, setRobotNumber] = useState('');

	const actualHandleSubmit = () => {
		const robonum: number = Number(robotNumber);
		dispatch(createForm(robonum));
		setRobotNumber('');
		props.handleSubmit(robonum);
	}

	return (
		<Dialog open={props.open} onClose={props.handleClose}>
			<DialogTitle>Add robot</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="robotNumber"
					label="Robot number"
					type="number"
					variant="outlined"
					value={robotNumber}
					onChange={(event) => setRobotNumber(event.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.handleClose}>Cancel</Button>
				<Button onClick={actualHandleSubmit}>Add</Button>
			</DialogActions>
		</Dialog>
	);
}
