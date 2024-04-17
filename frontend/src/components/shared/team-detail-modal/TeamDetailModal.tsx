import './TeamDetailModal.scss';
import React, { forwardRef } from 'react';
import { Dialog, DialogContent, IconButton, Slide } from '@mui/material';
import TeamDetail from '../../team-page/team-detail/TeamDetail';
import { useTranslator } from '../../../service/TranslateService';
import { ArrowBack } from '@mui/icons-material';
import CommentSection from '../../team-page/comment-section/CommentSection';

interface IProps {
	isOpen: boolean;
	handleClose: () => void;
	robotNumber: number;
	fullscreen?: boolean; // Stand-in for `isMobile` as well
	transition?: 'slide' | 'fade';
	afterClose?: () => void;
}

const SlideTransition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="left" ref={ ref } { ...props }>{ props.children }</Slide>;
});

export default function TeamDetailModal(props: IProps) {
	const translate = useTranslator();

	const transitionComponent = props.transition === 'slide' ? SlideTransition : undefined;

	return (
		<Dialog
			fullScreen={ props.fullscreen }
			open={ props.isOpen }
			onClose={ props.handleClose }
			aria-labelledby="team-detail-dialog__title"
			TransitionComponent={ transitionComponent }
			onTransitionExited={ props.afterClose }
		>
			<div className="team-detail-dialog__header">
				<IconButton
					id="team-detail-dialog__back-button"
					color="inherit"
					aria-label={ translate('CLOSE') }
					onClick={ props.handleClose }
				>
					<ArrowBack />
				</IconButton>
				<span id="team-detail-dialog__title">
					{ translate('TEAM') } { props.robotNumber ?? '' }
				</span>
			</div>
			<DialogContent
				dividers={ true }
				sx={{
					paddingLeft: '12px',
					paddingRight: '12px',
					paddingTop: '12px',
					paddingBottom: '32px',
					rowGap: '32px',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<TeamDetail robotNumber={ props.robotNumber } />
				{ props.robotNumber && <CommentSection teamNumber={ props.robotNumber } /> }
			</DialogContent>
		</Dialog>
	);
}
