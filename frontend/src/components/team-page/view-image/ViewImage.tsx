import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { LoadStatus } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { useAppSelector } from '../../../state';
import './ViewImage.scss';

interface IProps {
	robotNumber: number;
}

export default function ViewImage(props: IProps) {

	const [isOpen, setOpen] = useState(false);
	const translate = useTranslator();

	const imageState = useAppSelector(state => state.images[props.robotNumber]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	let image = null;
	switch (imageState?.loadStatus) {
		case undefined: // Fallthrough
		case LoadStatus.none:
			break;
		case LoadStatus.failed:
			image = <div>{ translate('FAILED_TO_LOAD_IMAGE') }</div>;
			break;
		case LoadStatus.loading:
			image = <div>{ translate('LOADING') }</div>;
			break;
		case LoadStatus.success:
		case LoadStatus.loadingWithPriorSuccess: // Fallthrough
		case LoadStatus.failedWithPriorSuccess: // Fallthrough
			if (imageState.info.present) {
				image = (
					<div className="team-notes-image">
						<img
							className="team-notes-image-content"
							src={ imageState.url }
							alt={ translate('ROBOT_OF_TEAM').replace('{TEAM_NUMBER}', String(props.robotNumber)) }
						/>
						<div className="team-notes-image-creator">
							{ imageState.info.creator }
						</div>
					</div>
				);
				break;
			}
			break;
	}

	return (
		<React.Fragment>
			<Tooltip title={ translate('VIEW_NOTES_FOR_THIS_TEAM') }>
				<Button
					id="view-notes-button"
					color="primary"
					variant="outlined"
					size="small"
					startIcon={ <Icon fontSize="small">image</Icon> }
					onClick={ handleOpen }
					disabled={ image === null }
					disableElevation
				>
					{ translate('IMAGE') }
				</Button>
			</Tooltip>
			<Dialog
				open={ isOpen }
				onClose={ handleClose }
			>
				<DialogTitle id="view-notes-title">
					{ translate('IMAGE') }
				</DialogTitle>
				<DialogContent>
					{ image }
				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						onClick={ handleClose }
					>
						{ translate('CLOSE') }
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);

}
