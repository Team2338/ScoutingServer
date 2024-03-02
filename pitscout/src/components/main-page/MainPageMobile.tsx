import React, { forwardRef, useEffect, useState } from 'react';
import { loadForms, selectForm, useAppDispatch, useAppSelector } from '../../state';
import { Statelet, UserRoles } from '../../models';
import { Button, Dialog, DialogContent, Icon, IconButton, Slide } from '@mui/material';
import RobotList from './robot-list/RobotList';
import AddRobotDialog from './add-robot-dialog/AddRobotDialog';
import InspectionForm from './inspection-form/InspectionForm';
import './MainPageMobile.scss';
import AddImageDialog from './add-image-dialog/AddImageDialog';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Transition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="up" ref={ ref } { ...props }>{ props.children }</Slide>;
});

export default function MainPageMobile() {

	const dispatch = useAppDispatch();
	const role: UserRoles = useAppSelector(state => state.login.token.role);
	const selectedRobot: number = useAppSelector(state => state.forms.selected);
	const [isAddDialogOpen, setAddDialogOpen]: Statelet<boolean> = useState<boolean>(false);
	const [isImageModalOpen, setImageModalOpen]: Statelet<boolean> = useState<boolean>(false);
	const _selectRobot = (robotNum: number) => dispatch(selectForm(robotNum));

	useEffect(() => {
		dispatch(loadForms());
	},
	[dispatch]);

	return (
		<main className="mobile__main-page">
			<Button
				id="robot-list-add"
				variant="text"
				onClick={ () => setAddDialogOpen(true) }
			>
				(+) Add robot
			</Button>
			<RobotList />

			<AddRobotDialog
				open={ isAddDialogOpen }
				handleClose={ () => setAddDialogOpen(false) }
				handleSubmit={ (robotNumber: number) => {
					setAddDialogOpen(false);
					_selectRobot(robotNumber);
				}}
			/>

			<Dialog
				fullScreen={ true }
				open={ !!selectedRobot }
				aria-labelledby="inspection-form-dialog__title"
				TransitionComponent={ Transition }
				onClose={ () => _selectRobot(null) }
			>
				<div className="inspection-form-dialog__header">
					<IconButton
						id="inspection-form-dialog__back-button"
						color="inherit"
						aria-label="Close"
						onClick={ () => _selectRobot(null) }
					>
						<Icon>close</Icon>
					</IconButton>
					<span id="inspection-form-dialog__title">
						Team { selectedRobot }
					</span>
					{
						role === UserRoles.admin &&
						<IconButton
							id="inspection-form-dialog__add-image-button"
							color="primary"
							onClick={ () => setImageModalOpen(true) }
						>
							<AddPhotoAlternateIcon />
						</IconButton>
					}
				</div>
				<DialogContent
					dividers={ true }
					sx={{
						paddingLeft: '8px',
						paddingRight: '8px',
						paddingTop: '8px'
					}}
				>
					{ selectedRobot && <InspectionForm robotNumber={ selectedRobot } /> }
				</DialogContent>
			</Dialog>
			<AddImageDialog
				robotNumber={ selectedRobot }
				isOpen={ isImageModalOpen }
				handleClose={ () => setImageModalOpen(false) }
			/>
		</main>
	);

}
