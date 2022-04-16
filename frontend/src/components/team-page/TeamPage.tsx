import './TeamPage.scss';
import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { connect } from 'react-redux';
import { Note, Team } from '../../models/response.model';
import { AppState } from '../../models/states.model';
import { selectTeam } from '../../state/Actions';
import { addNoteForRobot, getAllNotes, getMatches, getTeams } from '../../state/Effects';
import CreateNote from './create-note/CreateNote';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';
import { TeamSelector } from './team-selector/TeamSelector';

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
	selectTeam: (team: Team) => dispatch(selectTeam(team)),
	createNote: (robotNum: number, content: string) => dispatch(addNoteForRobot(robotNum, content))
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
	}

	render() {
		if (!this.props.areTeamsLoaded) {
			return <div className="team-page">Loading...</div>;
		}

		const notes: Note[] = this.props.notes.filter((note: Note) => note.robotNumber === this.props.selectedTeam?.id);
		return (
			<React.Fragment>
				<TeamPageContent
					teams={this.props.teams}
					selectTeam={this.props.selectTeam}
					selectedTeam={this.props.selectedTeam}
					notes={notes}
					createNote={this.props.createNote}
				/>
			</React.Fragment>
		);
	}
}

function TeamPageContent({ teams, selectTeam, selectedTeam, notes, createNote }) {
	const isMobile = useMediaQuery('(max-width: 600px)');

	if (isMobile) {
		return (
			<div className="page team-page-mobile">
				<div className="team-detail-wrapper">
					<TeamSelector
						teams={teams}
						selectTeam={selectTeam}
						selectedTeam={selectedTeam}
					/>
					<TeamDetail team={selectedTeam} notes={notes}/>
				</div>
				<CreateNote
					isMobile={true}
					selectedTeamNum={selectedTeam?.id}
					createNote={createNote}
				/>
			</div>
		);
	}

	return (
		<div className="page team-page">
			<div className="team-list-wrapper">
				<TeamList
					teams={teams}
					selectTeam={selectTeam}
					selectedTeam={selectedTeam}
				/>
			</div>
			<div className="team-detail-wrapper">
				<TeamDetail team={selectedTeam} notes={notes}/>
			</div>
			<CreateNote
				isMobile={false}
				selectedTeamNum={selectedTeam?.id}
				createNote={createNote}
			/>
		</div>
	);
}

const TeamPage = connect(inputs, outputs)(ConnectedTeamPage);
export default TeamPage;
