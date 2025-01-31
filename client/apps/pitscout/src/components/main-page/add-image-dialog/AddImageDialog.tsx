import React, {
	Fragment,
	useEffect,
	useState
} from 'react';
import './AddImageDialog.scss';
import {
	Alert,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar
} from '@mui/material';
import {
	AppDispatch,
	clearUploadError,
	resetImageUpload,
	uploadImage,
	useAppDispatch,
	useAppSelector
} from '../../../state';
import {
	FILE_SIZE_LIMIT_BYTES,
	Statelet,
	UploadErrors
} from '../../../models';
import ImagePicker from '../../image-picker/ImagePicker';
import { LoadStatus } from '@gearscout/models';

interface IProps {
	robotNumber: number;
	isOpen: boolean;
	handleClose: () => void;
}

export default function AddImageDialog(props: IProps) {
	const dispatch: AppDispatch = useAppDispatch();
	const [image, setImage]: Statelet<File> = useState<File>(null);
	const loadStatus: LoadStatus = useAppSelector(state => state.upload.loadStatus);
	const errorMessage: string = useAppSelector(state => state.upload.error);

	const isFileTooLarge: boolean = image?.size >= FILE_SIZE_LIMIT_BYTES;
	const isUploading: boolean = loadStatus === LoadStatus.loading;
	const handleCancel = () => {
		props.handleClose();
		setImage(null);
	};
	const { handleClose } = props; // Destructured for the effect dependency below

	useEffect(
		() => {
			if (loadStatus === LoadStatus.success) {
				setImage(null);
				handleClose();
				dispatch(resetImageUpload());
			}
		},
		[loadStatus, handleClose, dispatch]
	);

	const handleErrorToastClose = (event, reason): void => {
		if (reason === 'clickaway') {
			return;
		}

		dispatch(clearUploadError());
	};

	return (
		<Fragment>
			<Snackbar
				open={ !!errorMessage }
				autoHideDuration={ 6000 }
				onClose={ handleErrorToastClose }
				message={ errorMessage }
				sx={{ marginTop: '64px' }}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				<Alert
					severity="error"
					variant="filled"
					sx={{ width: '100%' }}
				>
					{ errorMessage }
				</Alert>
			</Snackbar>
			<Dialog open={ props.isOpen }>
				<DialogTitle>Upload image</DialogTitle>
				<DialogContent>
					<ImagePicker
						label="Choose image"
						helperText={ UploadErrors.fileTooLarge }
						isError={ isFileTooLarge }
						file={ image }
						setFile={ setImage }
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={ handleCancel }>Close</Button>
					<Button
						color="primary"
						variant="contained"
						disabled={ !image || isFileTooLarge || isUploading }
						onClick={ () => dispatch(uploadImage(image, String(props.robotNumber))) }
					>
						Upload
						{ isUploading && (
							<CircularProgress
								size={ 24 }
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									marginTop: '-12px',
									marginLeft: '-12px',
								}}
							/>
						)}
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
