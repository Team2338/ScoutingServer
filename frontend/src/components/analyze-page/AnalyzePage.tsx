import './AnalyzePage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { MatchResponse, Team } from '../../models/response.model';
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
	getTeamStats: (matches: MatchResponse[]) => dispatch(getTeams(matches)),
	selectTeam: (team: Team) => dispatch(selectTeam(team))
});

class ConnectedAnalyzePage extends React.Component<any, any> {

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		if (!this.props.areMatchesLoaded) {
			this.props.getMatches();

			return;
		}

		if (!this.props.areTeamsLoaded) {
			this.props.getTeamStats(this.props.rawMatches);
		}
	}

	render() {
		if (!this.props.areTeamsLoaded) {
			return <div className="analyze-page">Loading...</div>;
		}

		return (
			<div className="page analyze-page">
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

const AnalyzePage = connect(inputs, outputs)(ConnectedAnalyzePage);
export default AnalyzePage;
