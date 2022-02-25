import './StatPage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { Team } from '../../models/response.model';
import { AppState } from '../../models/states.model';
import { translate } from '../../service/TranslateService';
import { selectStat } from '../../state/Actions';
import { getGlobalStats, getMatches, getTeams } from '../../state/Effects';
import StatGraph from './stat-graph/StatGraph';
import StatList from './stat-list/StatList';

const inputs = (state: AppState) => ({
	areMatchesLoaded: state.matches.isLoaded,
	areTeamsLoaded: state.teams.isLoaded,
	areStatsLoaded: state.stats.isLoaded,
	teamData: state.teams.data,
	stats: state.stats.data,
	selectedStat: state.stats.selectedStat
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams()),
	getGlobalStats: () => dispatch(getGlobalStats()),
	selectStat: (gamemode: string, objective: string) => dispatch(selectStat(gamemode, objective))
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

		let content = <div>{ this.props.translate('SELECT_STAT_VIEW_MORE_DETAILS') }</div>;
		if (this.props.selectedStat) {
			const teamStats = this.props.teamData.map((team: Team) => (
				team.stats
					.get(this.props.selectedStat.gamemode)
					.get(this.props.selectedStat.objective)
			));

			const translatedGamemodeName = this.props.translate(this.props.selectedStat.gamemode);
			const translatedObjectiveName = this.props.translate(this.props.selectedStat.objective)
			const graphName = `[${translatedGamemodeName}] ${translatedObjectiveName}`;
			content = <StatGraph name={graphName} data={teamStats} metric="mean"/>;
		}

		return (
			<div className="page stat-page">
				<div className="stat-list-wrapper">
					<StatList
						stats={this.props.stats}
						selectedStat={this.props.selectedStat}
						selectStat={this.props.selectStat}
					/>
				</div>
				{ content }
			</div>
		);
	}
}

const StatPage = connect(inputs, outputs)(ConnectedStatPage);
export default translate(StatPage);
