import './TeamPage.scss';
import { useMediaQuery } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { Note, Team, AppState } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { selectTeam } from '../../state/Actions';
import { addNoteForRobot, getAllNotes, getMatches, getTeams } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import { TeamSelector } from '../shared/team-selector/TeamSelector';
import CreateNote from './create-note/CreateNote';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';

const inputs = (state: AppState) => ({
	areMatchesLoaded: state.matches.isLoaded,
	areTeamsLoaded: state.teams.isLoaded,
	areNotesLoaded: state.notes.isLoaded,
	rawMatches: state.matches.raw,
	teams: state.teams.data,
	selectedTeam: state.teams.selectedTeam,
	notes: state.notes.data
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams()),
	getNotes: () => dispatch(getAllNotes()),
});

class ConnectedTeamPage extends React.Component<any, any> {

	componentDidMount() {
		this.props.getNotes();

		if (!this.props.areMatchesLoaded) {
			this.props.getMatches();

			return;
		}

		if (!this.props.areTeamsLoaded) {
			this.props.getTeamStats();
		}

		if (!this.props.areNotesLoaded) {
			this.props.getNotes();
		}
	}

	getTeamsWithNotes = (): Team[] => {
		const noteTeamNumbers = this.props.notes.map((note: Note) => note.robotNumber);
		const uniqueNoteTeamNumbers = new Set(noteTeamNumbers);

		// This gives us the list of team numbers with notes but not match data
		for (const team of this.props.teams) {
			uniqueNoteTeamNumbers.delete(team.id);
		}

		const dummyTeamsWithNotes: Team[] = [];
		uniqueNoteTeamNumbers.forEach((teamNumber: number) => {
			dummyTeamsWithNotes.push({
				id: teamNumber,
				stats: null
			});
		});

		const completeListOfTeams: Team[] = this.props.teams.concat(dummyTeamsWithNotes);
		completeListOfTeams.sort((a: Team, b: Team) => a.id - b.id);

		return completeListOfTeams;
	};

	render() {
		if (!this.props.areTeamsLoaded) {
			return <div className="team-page">Loading...</div>;
		}

		const notes: Note[] = this.props.notes.filter((note: Note) => note.robotNumber === this.props.selectedTeam?.id);
		return (
			<TeamPageContent
				teams={this.getTeamsWithNotes()}
				notes={notes}
			/>
		);
	}
}

// function TeamPageContent() {
// 	const translate = useTranslator();
// 	const areTeamsLoaded: boolean = useAppSelector(state => state.teams.isLoaded);
// 	const teams: Team[] = useAppSelector(state => state.teams.data);
//
// 	if (!areTeamsLoaded) {
// 		return <div className="team-page">{ translate('LOADING') }</div>;
// 	}
// }

function TeamPageContent({ teams, notes }) {
	const isMobile = useMediaQuery('(max-width: 600px)');
	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const _selectTeam = (team: Team) => dispatch(selectTeam(team));
	const _createNote = (robotNum: number, content: string) => dispatch(addNoteForRobot(robotNum, content));
	const selectedTeam: Team = useAppSelector(state => state.teams.selectedTeam);

	if (isMobile) {
		return (
			<div className="page team-page-mobile">
				<div className="team-detail-wrapper">
					<TeamSelector
						teams={teams}
						selectTeam={_selectTeam}
						selectedTeam={selectedTeam}
					/>
					<TeamDetail team={selectedTeam} notes={notes}/>
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
					teams={teams}
					selectTeam={_selectTeam}
					selectedTeam={selectedTeam}
				/>
			</div>
			<div className="team-detail-wrapper">
				<TeamDetail team={selectedTeam} notes={notes}/>
			</div>
			<CreateNote
				isMobile={false}
				selectedTeamNum={selectedTeam?.id}
				createNote={_createNote}
			/>
		</div>
	);
}

const TeamPage = connect(inputs, outputs)(ConnectedTeamPage);
export default TeamPage;
