import React, { useEffect, useState } from 'react';
import './MainPage.scss';
import { closeSnackbar, loadForms, selectForm, useAppDispatch, useAppSelector } from '../../state';
import InspectionForm from './inspection-form/InspectionForm';
import {
	Alert,
	Button,
	Slide,
	SlideProps,
	Snackbar
} from '@mui/material';
import { Statelet } from '../../models';
import AddRobotDialog from './add-robot-dialog/AddRobotDialog';
import RobotList from './robot-list/RobotList';

function SlideTransition(props: SlideProps) {
	return <Slide {...props} direction="down"/>;
}

export default function MainPage() {

	const dispatch = useAppDispatch();
	const selectedRobot: number = useAppSelector(state => state.forms.selected);
	const snackbar = useAppSelector(state => state.snackbar);
	const [isModalOpen, setModalOpen]: Statelet<boolean> = useState<boolean>(false);
	const _closeSnackbar = () => dispatch(closeSnackbar());

	const detailSection = (selectedRobot !== null)
		? <InspectionForm robotNumber={ selectedRobot }/>
		: <div>Pick or add a robot number!</div>;

	useEffect(() => {
		dispatch(loadForms());
	}, [dispatch]);

	return (
		<div className="main-page">
			<Snackbar
				autoHideDuration={ 6000 }
				open={ !!snackbar.isOpen }
				onClose={ _closeSnackbar }
				TransitionComponent={ SlideTransition }
				anchorOrigin={{
					horizontal: 'center',
					vertical: 'top'
				}}
			>
				<Alert
					variant="filled"
					elevation={ 6 }
					severity={ snackbar.severity }
					onClose={ _closeSnackbar }
					sx={{ width: '100%' }}
				>
					{ snackbar.message }
				</Alert>
			</Snackbar>

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
