import { Dialog, DialogContent, IconButton, Slide, useMediaQuery } from '@mui/material';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { LoadStatus, Note, Team } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import {
	addNoteForRobot,
	getAllImageInfoForEvent,
	getAllNotes,
	selectTeam,
	useAppDispatch,
	useAppSelector,
	useDataInitializer
} from '../../state';
import CreateNote from './create-note/CreateNote';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';
import './TeamPage.scss';
import { ArrowBack } from '@mui/icons-material';

const Transition = forwardRef(function Transition(props: any, ref) {
	return <Slide direction="left" ref={ ref } children={ props.children } { ...props } />;
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
			dispatch(getAllImageInfoForEvent());
		},
		[dispatch]
	);

	// Selectors
	const teamNumbersWithImages: number[] = useAppSelector(state => Object.getOwnPropertyNames(state.images).map(num => Number(num)));
	const teamsLoadStatus: LoadStatus = useAppSelector(state => state.teams.loadStatus);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const selectedTeam: Team = useAppSelector(state => state.teams.selectedTeam);
	const notes: Note[] = useAppSelector(state => state.notes.data);
	const filteredNotes: Note[] = notes.filter((note: Note) => note.robotNumber === selectedTeam?.id);

	const allTeams: Team[] = useMemo(
		() => getTeamsWithNotesOrDataOrImages(teams, notes, teamNumbersWithImages),
		[teams, notes, teamNumbersWithImages]
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
							aria-label="back" // TODO: translate
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
						sx={ {
							paddingLeft: '8px',
							paddingRight: '8px',
							paddingTop: '12px'
						} }
					>
						<TeamDetail team={ selectedTeam } notes={ filteredNotes }/>
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
			</div>
			<CreateNote
				isMobile={ false }
				selectedTeamNum={ selectedTeam?.id }
				createNote={ _createNote }
			/>
		</div>
	);
}

const getTeamsWithNotesOrDataOrImages = (teamsWithData: Team[], notes: Note[], teamNumbersWithImages: number[]): Team[] => {
	const teamNumbersWithNotes: number[] = notes.map((note: Note) => note.robotNumber);
	const uniqueTeamNumbersWithNotesOrImages: Set<number> = new Set([...teamNumbersWithNotes, ...teamNumbersWithImages]);

	// This gives us the list of team numbers with notes but not match data
	for (const team of teamsWithData) {
		uniqueTeamNumbersWithNotesOrImages.delete(team.id);
	}

	const completeListOfTeams: Team[] = teamsWithData.slice();
	uniqueTeamNumbersWithNotesOrImages.forEach((teamNumber: number) => {
		completeListOfTeams.push({
			id: teamNumber,
			stats: null
		});
	});

	completeListOfTeams.sort((a: Team, b: Team) => a.id - b.id);

	return completeListOfTeams;
};
