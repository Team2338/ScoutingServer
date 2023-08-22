import React, { useState } from 'react';
import './MainPage.scss';
import { selectForm, useAppDispatch, useAppSelector } from '../../state';
import DetailNoteForm from './detail-note-form/DetailNoteForm';
import {
	Button,
} from '@mui/material';
import { Statelet } from '../../models';
import AddRobotDialog from './add-robot-dialog/AddRobotDialog';
import RobotList from './robot-list/RobotList';

export default function MainPage() {

	const dispatch = useAppDispatch();
	const selectedRobot: number = useAppSelector(state => state.forms.selected?.robotNumber);
	const [isModalOpen, setModalOpen]: Statelet<boolean> = useState<boolean>(false);

	const detailSection = !!selectedRobot
		? <DetailNoteForm robotNumber={ selectedRobot }/>
		: <div>Pick or add a robot number!</div>;

	return (
		<div className="main-page">
			<div className="robot-list-wrapper">
				<Button
					id="robot-list-add"
					variant="text"
					onClick={ () => setModalOpen(true) }
				>
					(+) Add robot
				</Button>
				<RobotList/>
			</div>
			<div className="detail-section">
				{ detailSection }
			</div>
			<AddRobotDialog
				open={ isModalOpen }
				handleClose={ () => setModalOpen(false) }
				handleSubmit={ (robotNumber: number) => {
					dispatch(selectForm(robotNumber));
					setModalOpen(false);
				}}
			/>
		</div>
	);
}
