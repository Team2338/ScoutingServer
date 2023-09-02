import React, { useEffect, useState } from 'react';
import './MainPage.scss';
import { loadForms, selectForm, useAppDispatch, useAppSelector } from '../../state';
import InspectionForm from './inspection-form/InspectionForm';
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
		? <InspectionForm robotNumber={ selectedRobot }/>
		: <div>Pick or add a robot number!</div>;

	useEffect(() => {
		dispatch(loadForms());
	}, [dispatch]);

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
