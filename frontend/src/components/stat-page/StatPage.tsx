import './StatPage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';
import { getGlobalStats, getMatches, getTeams } from '../../state/Effects';
import StatList from './stat-list/StatList';

const inputs = (state: AppState) => ({
	areMatchesLoaded: state.matches.isLoaded,
	areTeamsLoaded: state.teams.isLoaded,
	areStatsLoaded: state.stats.isLoaded,
	stats: state.stats.data
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams()),
	getGlobalStats: () => dispatch(getGlobalStats())
});

class ConnectedStatPage extends React.Component<any, any> {

	componentDidMount() {
		if (!this.props.areMatchesLoaded) {
			this.props.getMatches();
			return;
		}

		if (!this.props.areTeamsLoaded) {
			this.props.getTeamStats();
			return;
		}

		if (!this.props.areStatsLoaded) {
			this.props.getGlobalStats();
		}
	}

	render() {
		if (!this.props.areStatsLoaded) {
			return <div className="stat-page">Loading...</div>;
		}

		return (
			<div className="page stat-page">
				<div className="stat-list-wrapper">
					<StatList stats={this.props.stats} />
				</div>
				Stat page!
			</div>
		);
	}
}

const StatPage = connect(inputs, outputs)(ConnectedStatPage);
export default StatPage;
