import { useMediaQuery } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { ImageState, Inspection, LoadStatus, Team } from '../../models';
import {
	getAllImageInfoForEvent,
	getInspections,
	selectTeam,
	useAppDispatch,
	useAppSelector,
	useDataInitializer
} from '../../state';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';
import './TeamPage.scss';
import DataFailure from '../shared/data-failure/DataFailure';
import TeamListSkeleton from './team-list-skeleton/TeamListSkeleton';
import TeamDetailModal from '../shared/team-detail-modal/TeamDetailModal';


export default function TeamPage() {
	const isMobile = useMediaQuery('(max-width: 600px)');
	useDataInitializer();

	// Dispatch and actions
	const dispatch = useAppDispatch();
	const _deselectTeam = () => dispatch(selectTeam(null));

	useEffect(
		() => {
			dispatch(getAllImageInfoForEvent());
			dispatch(getInspections());
		},
		[dispatch]
	);

	// Selectors
	const images: ImageState = useAppSelector(state => state.images);
	const inspections: Inspection[] = useAppSelector(state => state.inspections.inspections);
	const teamsLoadStatus: LoadStatus = useAppSelector(state => state.teams.loadStatus);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const selectedRobotNumber: number = useAppSelector(state => state.teams.selectedTeam);

	const allTeams: Team[] = useMemo(
		() => getTeamsWithDataOrImagesOrCommentsOrInspections(
			teams,
			images,
			inspections
		),
		[teams, images, inspections]
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
				<TeamDetailModal
					isOpen={ !!selectedRobotNumber }
					handleClose={ () => _deselectTeam() }
					robotNumber={ selectedRobotNumber }
					fullscreen={ true }
					transition="slide"
				/>
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
			</div>
		</main>
	);
}

const getTeamsWithDataOrImagesOrCommentsOrInspections = (
	teamsWithData: Team[],
	images: ImageState,
	inspections: Inspection[]
): Team[] => {
	const teamNumbersWithImages: number[] = Object.getOwnPropertyNames(images.images).map(num => Number(num));
	const teamNumbersWithInspections: number[] = inspections.map((inspection: Inspection) => inspection.robotNumber);
	const uniqueTeamNumbersWithImagesOrCommentsOrInspections: Set<number> = new Set([
		...teamNumbersWithImages,
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
