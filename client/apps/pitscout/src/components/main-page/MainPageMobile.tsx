import React, {
	forwardRef,
	useEffect,
	useState
} from 'react';
import {
	closeSnackbar,
	loadForms,
	selectForm,
	uploadOfflineForms,
	useAppDispatch,
	useAppSelector
} from '../../state';
import { Statelet } from '../../models';
import {
	Alert,
	Button,
	Dialog,
	DialogContent,
	Icon,
	IconButton,
	Slide,
	SlideProps,
	Snackbar
} from '@mui/material';
import RobotList from './robot-list/RobotList';
import AddRobotDialog from './add-robot-dialog/AddRobotDialog';
import './MainPageMobile.scss';
import AddImageDialog from './add-image-dialog/AddImageDialog';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import RobotListSkeleton from './robot-list-skeleton/RobotListSkeleton';
import {
	LoadStatus,
	UserRole
} from '@gearscout/models';
import InspectionForm2025 from './inspection-form/2025/InspectionForm2025';

const InspectionTransition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="up" ref={ ref } { ...props }>{ props.children }</Slide>;
});

function SnackbarTransition(props: SlideProps) {
	return <Slide {...props} direction="down"/>;
}

export default function MainPageMobile() {

	const dispatch = useAppDispatch();
	const role: UserRole = useAppSelector(state => state.login.role);
	const selectedRobot: number = useAppSelector(state => state.forms.selected);
	const snackbar = useAppSelector(state => state.snackbar);
	const hasOfflineForms: boolean = useAppSelector(state => state.forms.offline.length > 0);
	const loadStatus: LoadStatus = useAppSelector(state => state.forms.loadStatus);
	const [isAddDialogOpen, setAddDialogOpen]: Statelet<boolean> = useState<boolean>(false);
	const [isImageModalOpen, setImageModalOpen]: Statelet<boolean> = useState<boolean>(false);
	const _selectRobot = (robotNum: number) => dispatch(selectForm(robotNum));
	const _closeSnackbar = () => dispatch(closeSnackbar());
	const _resendOfflineForms = () => dispatch(uploadOfflineForms());

	const showSkeletonLoader: boolean = (loadStatus === LoadStatus.none) || (loadStatus === LoadStatus.loading);

	useEffect(() => {
		dispatch(loadForms());
	},
	[dispatch]);

	return (
		<main className="mobile__main-page">
			<Snackbar
				autoHideDuration={ 6000 }
				open={ !!snackbar.isOpen }
				onClose={ _closeSnackbar }
				TransitionComponent={ SnackbarTransition }
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
			{ hasOfflineForms && (
				<Button
					id="resend-offline-button"
					variant="contained"
					color="secondary"
					onClick={ _resendOfflineForms }
				>
					Resend offline inspections
				</Button>
			)}
			<Button
				id="robot-list-add"
				variant="text"
				onClick={ () => setAddDialogOpen(true) }
			>
				(+) Add robot
			</Button>
			{ showSkeletonLoader ? <RobotListSkeleton /> : <RobotList /> }

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
				TransitionComponent={ InspectionTransition }
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
						(role === UserRole.superAdmin || role === UserRole.admin) &&
						<IconButton
							id="inspection-form-dialog__add-image-button"
							color="primary"
							onClick={ () => setImageModalOpen(true) }
						>
							<AddPhotoAlternateIcon />
						</IconButton>
					}
				</div>
				<DialogContent id="inspection-form-dialog__body">
					{
						selectedRobot &&
						// <InspectionForm2024 robotNumber={ selectedRobot } shouldFloatSubmit={ true } />
						<InspectionForm2025 robotNumber={ selectedRobot } />
					}
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
