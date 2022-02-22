import './TeamPage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { Team } from '../../models/response.model';
import { AppState } from '../../models/states.model';
import { selectTeam } from '../../state/Actions';
import { getMatches, getTeams } from '../../state/Effects';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';

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
		console.log(this.props.areTeamsLoaded);

		if (!this.props.areTeamsLoaded) {
			return <div className="team-page">Loading...</div>;
		}

		return (
			<div className="page team-page">
				<div className="team-list-wrapper">
					<TeamList
						teams={this.props.teams}
						selectTeam={this.props.selectTeam}
						selectedTeam={this.props.selectedTeam}
					/>
				</div>
				<TeamDetail team={this.props.selectedTeam}/>
			</div>
		);
	}
}

const TeamPage = connect(inputs, outputs)(ConnectedTeamPage);
export default TeamPage;
