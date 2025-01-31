import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle
} from '@mui/material';

interface IProps {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export function ConfirmationModal(props: IProps) {
	return (
		<Dialog open={ props.open } onClose={ props.onCancel }>
			<DialogTitle>Leave without saving?</DialogTitle>
			<DialogContent>
				You have unsaved changes. If you leave now, these changes will be lost.
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					onClick={ props.onCancel }
				>
					Stay
				</Button>
				<Button
					variant="contained"
					color="error"
					disableElevation={ true }
					onClick={ props.onConfirm }
				>
					Leave
				</Button>
			</DialogActions>
		</Dialog>
	);
}
