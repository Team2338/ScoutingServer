import { Dialog, DialogContent, IconButton, Slide, useMediaQuery } from '@mui/material';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { CommentsForEvent, ImageState, Inspection, LoadStatus, Team } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import {
	getAllImageInfoForEvent,
	getComments,
	getInspections,
	selectTeam,
	useAppDispatch,
	useAppSelector,
	useDataInitializer
} from '../../state';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';
import './TeamPage.scss';
import { ArrowBack } from '@mui/icons-material';
import CommentSection from './comment-section/CommentSection';
import DataFailure from '../shared/data-failure/DataFailure';
import TeamListSkeleton from './team-list-skeleton/TeamListSkeleton';

const Transition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="left" ref={ ref } { ...props } >{ props.children }</Slide>;
});

export default function TeamPage() {
	const isMobile = useMediaQuery('(max-width: 600px)');
	const translate = useTranslator();
	useDataInitializer();

	// Dispatch and actions
	const dispatch = useAppDispatch();
	const _deselectTeam = () => dispatch(selectTeam(null));

	useEffect(
		() => {
			dispatch(getComments());
			dispatch(getAllImageInfoForEvent());
			dispatch(getInspections());
		},
		[dispatch]
	);

	// Selectors
	const images: ImageState = useAppSelector(state => state.images);
	const comments: CommentsForEvent = useAppSelector(state => state.comments.comments);
	const inspections: Inspection[] = useAppSelector(state => state.inspections.inspections);
	const teamsLoadStatus: LoadStatus = useAppSelector(state => state.teams.loadStatus);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const selectedRobotNumber: number = useAppSelector(state => state.teams.selectedTeam);

	const allTeams: Team[] = useMemo(
		() => getTeamsWithDataOrImagesOrCommentsOrInspections(
			teams,
			images,
			comments,
			inspections
		),
		[teams, images, comments, inspections]
	);

	if (teamsLoadStatus === LoadStatus.none || teamsLoadStatus === LoadStatus.loading) {
		return <main className="team-page">
			<TeamListSkeleton isMobile={ isMobile } />
		</main>;
	}

	if (teamsLoadStatus === LoadStatus.failed) {
		return (
			<main className="page team-page team-page-failed">
				<DataFailure messageKey="FAILED_TO_LOAD_TEAMS" />
			</main>
		);
	}

	// TODO: Fix the padding and margins of TeamDetail
	if (isMobile) {
		return (
			<main className="page team-page-mobile">
				<TeamList teams={ allTeams } />
				<Dialog
					fullScreen={ true }
					open={ !!selectedRobotNumber }
					onClose={ () => _deselectTeam() }
					aria-labelledby="team-detail-dialog__title"
					TransitionComponent={ Transition }
				>
					<div className="team-detail-dialog__header">
						<IconButton
							id="team-detail-dialog__back-button"
							color="inherit"
							aria-label={ translate('CLOSE') }
							onClick={ () => _deselectTeam() }
						>
							<ArrowBack />
						</IconButton>
						<span id="team-detail-dialog__title">
							{ translate('TEAM') } { selectedRobotNumber ?? '' }
						</span>
					</div>
					<DialogContent
						dividers={ true }
						sx={ {
							paddingLeft: '8px',
							paddingRight: '8px',
							paddingTop: '12px',
							paddingBottom: '32px',
							rowGap: '32px',
							display: 'flex',
							flexDirection: 'column'
						} }
					>
						<TeamDetail robotNumber={ selectedRobotNumber } />
						{ selectedRobotNumber && <CommentSection teamNumber={ selectedRobotNumber } /> }
					</DialogContent>
				</Dialog>
			</main>
		);
	}

	return (
		<main className="page team-page">
			<div className="team-list-wrapper">
				<TeamList teams={ allTeams } />
			</div>
			<div className="team-detail-wrapper">
				<TeamDetail robotNumber={ selectedRobotNumber } />
				{ selectedRobotNumber && <CommentSection teamNumber={ selectedRobotNumber } /> }
			</div>
		</main>
	);
}

const getTeamsWithDataOrImagesOrCommentsOrInspections = (
	teamsWithData: Team[],
	images: ImageState,
	comments: CommentsForEvent,
	inspections: Inspection[]
): Team[] => {
	const teamNumbersWithImages: number[] = Object.getOwnPropertyNames(images.images).map(num => Number(num));
	const teamNumbersWithComments: number[] = Object.getOwnPropertyNames(comments).map(num => Number(num));
	const teamNumbersWithInspections: number[] = inspections.map((inspection: Inspection) => inspection.robotNumber);
	const uniqueTeamNumbersWithImagesOrCommentsOrInspections: Set<number> = new Set([
		...teamNumbersWithImages,
		...teamNumbersWithComments,
		...teamNumbersWithInspections
	]);

	// This gives us the list of team numbers with images or comments but not match data
	for (const team of teamsWithData) {
		uniqueTeamNumbersWithImagesOrCommentsOrInspections.delete(team.id);
	}

	const completeListOfTeams: Team[] = teamsWithData.slice();
	uniqueTeamNumbersWithImagesOrCommentsOrInspections.forEach((teamNumber: number) => {
		completeListOfTeams.push({
			id: teamNumber,
			stats: null
		});
	});

	completeListOfTeams.sort((a: Team, b: Team) => a.id - b.id);

	return completeListOfTeams;
};
