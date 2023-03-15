import { useMediaQuery } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { LoadStatus, Note, Team } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { selectTeam } from '../../state/Actions';
import { addNoteForRobot, getAllNotes } from '../../state/Effects';
import { useAppDispatch, useAppSelector, useDataInitializer } from '../../state/Hooks';
import { TeamSelector } from '../shared/team-selector/TeamSelector';
import CreateNote from './create-note/CreateNote';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';
import './TeamPage.scss';


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
			dispatch(getAllNotes())
		},
		[dispatch]
	);

	// Selectors
	const teamsLoadStatus: LoadStatus = useAppSelector(state => state.teams.loadStatus);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const selectedTeam: Team = useAppSelector(state => state.teams.selectedTeam);
	const notes: Note[] = useAppSelector(state => state.notes.data);
	const filteredNotes: Note[] = notes.filter((note: Note) => note.robotNumber === selectedTeam?.id);

	const allTeams: Team[] = useMemo(
		() => getTeamsWithNotesOrData(teams, notes),
		[teams, notes]
	);

	if (teamsLoadStatus === LoadStatus.none || teamsLoadStatus === LoadStatus.loading) {
		return <div className="team-page">{ translate('LOADING') }</div>;
	}

	if (teamsLoadStatus === LoadStatus.failed) {
		return <div className="team-page">{ translate('FAILED_TO_LOAD_TEAMS') }</div>;
	}

	if (isMobile) {
		return (
			<div className="page team-page-mobile">
				<div className="team-detail-wrapper">
					<TeamSelector
						teams={allTeams}
						selectTeam={_selectTeam}
						selectedTeam={selectedTeam}
					/>
					<TeamDetail team={selectedTeam} notes={filteredNotes}/>
				</div>
				<CreateNote
					isMobile={true}
					selectedTeamNum={selectedTeam?.id}
					createNote={_createNote}
				/>
			</div>
		);
	}

	return (
		<div className="page team-page">
			<div className="team-list-wrapper">
				<TeamList
					teams={allTeams}
					selectTeam={_selectTeam}
					selectedTeam={selectedTeam}
				/>
			</div>
			<div className="team-detail-wrapper">
				<TeamDetail team={selectedTeam} notes={filteredNotes}/>
			</div>
			<CreateNote
				isMobile={false}
				selectedTeamNum={selectedTeam?.id}
				createNote={_createNote}
			/>
		</div>
	);
}

const getTeamsWithNotesOrData = (teamsWithData: Team[], notes: Note[]): Team[] => {
	const teamNumbersWithNotes = notes.map((note: Note) => note.robotNumber);
	const uniqueTeamNumbersWithNotes = new Set(teamNumbersWithNotes);

	// This gives us the list of team numbers with notes but not match data
	for (const team of teamsWithData) {
		uniqueTeamNumbersWithNotes.delete(team.id);
	}

	const completeListOfTeams: Team[] = teamsWithData.slice();
	uniqueTeamNumbersWithNotes.forEach((teamNumber: number) => {
		completeListOfTeams.push({
			id: teamNumber,
			stats: null
		});
	});

	completeListOfTeams.sort((a: Team, b: Team) => a.id - b.id);

	return completeListOfTeams;
};
