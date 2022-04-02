import './TeamPage.scss';
import { useMediaQuery } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Team } from '../../models/response.model';
import { AppState } from '../../models/states.model';
import { selectTeam } from '../../state/Actions';
import { getMatches, getTeams } from '../../state/Effects';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';
import { TeamSelector } from './team-selector/TeamSelector';

const inputs = (state: AppState) => ({
	areMatchesLoaded: state.matches.isLoaded,
	areTeamsLoaded: state.teams.isLoaded,
	rawMatches: state.matches.raw,
	teams: state.teams.data,
	selectedTeam: state.teams.selectedTeam
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams()),
	selectTeam: (team: Team) => dispatch(selectTeam(team))
});

class ConnectedTeamPage extends React.Component<any, any> {

	componentDidMount() {
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

		return (
			<TeamPageContent
				teams={this.props.teams}
				selectTeam={this.props.selectTeam}
				selectedTeam={this.props.selectedTeam}
			/>
		);
	}
}

function TeamPageContent({ teams, selectTeam, selectedTeam }) {
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
					<TeamDetail team={selectedTeam}/>
				</div>
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
			<TeamDetail team={selectedTeam}/>
		</div>
	);
}


const TeamPage = connect(inputs, outputs)(ConnectedTeamPage);
export default TeamPage;
