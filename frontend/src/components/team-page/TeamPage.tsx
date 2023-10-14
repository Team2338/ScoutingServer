import { Dialog, DialogContent, IconButton, Slide, useMediaQuery } from '@mui/material';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { LoadStatus, Note, Team } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import {
	addNoteForRobot,
	getAllImageInfoForEvent,
	getAllNotes,
	getComments,
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

const Transition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="left" ref={ ref } { ...props } >{ props.children }</Slide>;
});

export default function TeamPage() {
	const isMobile = useMediaQuery('(max-width: 600px)');
	const translate = useTranslator();
	useDataInitializer();

	// Dispatch and actions
	const dispatch = useAppDispatch();
	const _selectTeam = (team: Team) => dispatch(selectTeam(team));
	const _createNote = (robotNum: number, content: string) => dispatch(addNoteForRobot(robotNum, content));

	useEffect(
		() => {
			dispatch(getAllNotes());
			dispatch(getComments());
			dispatch(getAllImageInfoForEvent());
		},
		[dispatch]
	);

	// Selectors
	const teamNumbersWithImages: number[] = useAppSelector(state => Object.getOwnPropertyNames(state.images).map(num => Number(num)));
	const teamNumbersWithComments: number[] = useAppSelector(state => Object.getOwnPropertyNames(state.comments.comments).map(num => Number(num)));
	const teamsLoadStatus: LoadStatus = useAppSelector(state => state.teams.loadStatus);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const selectedTeam: Team = useAppSelector(state => state.teams.selectedTeam);
	const notes: Note[] = useAppSelector(state => state.notes.data);
	const filteredNotes: Note[] = notes.filter((note: Note) => note.robotNumber === selectedTeam?.id);

	const allTeams: Team[] = useMemo(
		() => getTeamsWithNotesOrDataOrImagesOrComments(teams, notes, teamNumbersWithImages, teamNumbersWithComments),
		[teams, notes, teamNumbersWithImages, teamNumbersWithComments]
	);

	if (teamsLoadStatus === LoadStatus.none || teamsLoadStatus === LoadStatus.loading) {
		return <div className="team-page">{ translate('LOADING') }</div>;
	}

	if (teamsLoadStatus === LoadStatus.failed) {
		return <div className="team-page">{ translate('FAILED_TO_LOAD_TEAMS') }</div>;
	}

	// TODO: Fix the padding and margins of TeamDetail
	if (isMobile) {
		return (
			<div className="page team-page-mobile">
				<TeamList teams={ allTeams } selectTeam={ _selectTeam } selectedTeam={ selectedTeam }/>
				<Dialog
					fullScreen={ true }
					open={ !!selectedTeam }
					onClose={ () => _selectTeam(null) }
					aria-labelledby="team-detail-dialog__title"
					TransitionComponent={ Transition }
				>
					<div className="team-detail-dialog__header">
						<IconButton
							id="team-detail-dialog__back-button"
							color="inherit"
							aria-label={ translate('CLOSE') }
							onClick={ () => _selectTeam(null) }
						>
							<ArrowBack/>
						</IconButton>
						<span id="team-detail-dialog__title">
							{ translate('TEAM') } { selectedTeam?.id ?? '' }
						</span>
					</div>
					<DialogContent
						dividers={ true }
						sx={{
							paddingLeft: '8px',
							paddingRight: '8px',
							paddingTop: '12px'
						}}
					>
						<TeamDetail team={ selectedTeam } notes={ filteredNotes } />
						<CommentSection teamNumber={ selectedTeam.id }/>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<div className="page team-page">
			<div className="team-list-wrapper">
				<TeamList
					teams={ allTeams }
					selectTeam={ _selectTeam }
					selectedTeam={ selectedTeam }
				/>
			</div>
			<div className="team-detail-wrapper">
				<TeamDetail team={ selectedTeam } notes={ filteredNotes }/>
				{ selectedTeam && <CommentSection teamNumber={ selectedTeam.id }/> }
			</div>
		</div>
	);
}

const getTeamsWithNotesOrDataOrImagesOrComments = (
	teamsWithData: Team[],
	notes: Note[],
	teamNumbersWithImages: number[],
	teamNumbersWithComments: number[]
): Team[] => {
	const teamNumbersWithNotes: number[] = notes.map((note: Note) => note.robotNumber);
	const uniqueTeamNumbersWithNotesOrImagesOrComments: Set<number> = new Set([...teamNumbersWithNotes, ...teamNumbersWithImages, ...teamNumbersWithComments]);

	// This gives us the list of team numbers with notes but not match data
	for (const team of teamsWithData) {
		uniqueTeamNumbersWithNotesOrImagesOrComments.delete(team.id);
	}

	const completeListOfTeams: Team[] = teamsWithData.slice();
	uniqueTeamNumbersWithNotesOrImagesOrComments.forEach((teamNumber: number) => {
		completeListOfTeams.push({
			id: teamNumber,
			stats: null
		});
	});

	completeListOfTeams.sort((a: Team, b: Team) => a.id - b.id);

	return completeListOfTeams;
};
