import React, { useEffect, useState } from 'react';
import './MainPage.scss';
import {
	closeSnackbar,
	loadForms,
	selectForm,
	useAppDispatch,
	useAppSelector
} from '../../state';
import InspectionForm from './inspection-form/InspectionForm';
import {
	Alert,
	Button,
	Slide,
	SlideProps,
	Snackbar,
	useMediaQuery
} from '@mui/material';
import { Statelet } from '../../models';
import AddRobotDialog from './add-robot-dialog/AddRobotDialog';
import RobotList from './robot-list/RobotList';
import MainPageMobile from './MainPageMobile';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddImageDialog from './add-image-dialog/AddImageDialog';
import RobotListSkeleton from './robot-list-skeleton/RobotListSkeleton';
import { LoadStatus, UserRole } from '@gearscout/models';
import InspectionForm2025 from './inspection-form/2025/InspectionForm2025';

function SlideTransition(props: SlideProps) {
	return <Slide {...props} direction="down"/>;
}

export default function MainPage() {

	const dispatch = useAppDispatch();
	const isMobile: boolean = useMediaQuery('(max-width: 700px)');
	const role: UserRole = useAppSelector(state => state.login.role);
	const selectedRobot: number = useAppSelector(state => state.forms.selected);
	const snackbar = useAppSelector(state => state.snackbar);
	const loadStatus: LoadStatus = useAppSelector(state => state.forms.loadStatus);
	const [isNewRobotModalOpen, setNewRobotModalOpen]: Statelet<boolean> = useState<boolean>(false);
	const [isImageModalOpen, setImageModalOpen]: Statelet<boolean> = useState<boolean>(false);
	const _closeSnackbar = () => dispatch(closeSnackbar());

	const showSkeletonLoader: boolean = (loadStatus === LoadStatus.none) || (loadStatus === LoadStatus.loading);

	useEffect(() => {
		dispatch(loadForms());
	}, [dispatch]);

	if (isMobile) {
		return <MainPageMobile />;
	}

	const addImageButton = role === UserRole.admin && (
		<Button
			id="add-image-button"
			aria-label="Add image"
			color="primary"
			variant="contained"
			startIcon={ <AddPhotoAlternateIcon/> }
			disableElevation={ true }
			onClick={ () => setImageModalOpen(true) }
		>
			Add image
		</Button>
	);

	const detailSection = (selectedRobot !== null)
		? (
			<div className="detail-section">
				<div className="title-area">
					<h1 className="title">Team { selectedRobot }</h1>
					{ addImageButton }
				</div>
				<InspectionForm robotNumber={ selectedRobot } />
			</div>
		)
		: <div>Pick or add a robot number!</div>;

	return (
		<main className="main-page">
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
					onClick={ () => setNewRobotModalOpen(true) }
				>
					(+) Add robot
				</Button>
				{ showSkeletonLoader ? <RobotListSkeleton /> : <RobotList /> }
			</div>
			{ detailSection }
			<AddRobotDialog
				open={ isNewRobotModalOpen }
				handleClose={ () => setNewRobotModalOpen(false) }
				handleSubmit={ (robotNumber: number) => {
					dispatch(selectForm(robotNumber));
					setNewRobotModalOpen(false);
				}}
			/>
			<AddImageDialog
				robotNumber={ selectedRobot }
				isOpen={ isImageModalOpen }
				handleClose={ () => setImageModalOpen(false) }
			/>
		</main>
	);
}
