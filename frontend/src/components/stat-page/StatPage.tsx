import './StatPage.scss';
import React from 'react';
import { connect } from 'react-redux';
import {
	AppState,
	GlobalObjectiveStats,
	ObjectiveDescriptor,
	Team,
	TeamObjectiveStats
} from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { selectStat } from '../../state/Actions';
import { getGlobalStats, getMatches, getTeams } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import StatGraph from './stat-graph/StatGraph';
import StatList from './stat-list/StatList';
import StatTable from './stat-table/StatTable';

const inputs = (state: AppState) => ({
	areMatchesLoaded: state.matches.isLoaded,
	areTeamsLoaded: state.teams.isLoaded,
	areStatsLoaded: state.stats.isLoaded,
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams()),
	getGlobalStats: () => dispatch(getGlobalStats()),
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
		return <StatPageContent/>
	}
}

function StatPageContent() {
	const dispatch = useAppDispatch();
	const _selectStat = (gamemode: string, objective: string) => dispatch(selectStat(gamemode, objective));
	const translate = useTranslator();
	const areStatsLoaded: boolean = useAppSelector(state => state.stats.isLoaded);
	const teamData: Team[] = useAppSelector(state => state.teams.data);
	const stats: GlobalObjectiveStats[] = useAppSelector(state => state.stats.data);
	const selectedStat: ObjectiveDescriptor = useAppSelector(state => state.stats.selectedStat);

	if (!areStatsLoaded) {
		return <div className="stat-page">Loading...</div>;
	}

	let content = <div>{ translate('SELECT_STAT_VIEW_MORE_DETAILS') }</div>
	if (selectedStat) {
		const teamStats: TeamObjectiveStats[] = teamData
			.map((team: Team) => team.stats
				.get(selectedStat.gamemode)
				?.get(selectedStat.objective)
			)
			.filter((objective: TeamObjectiveStats) => !!objective);

		const translatedGamemodeName: string = translate(selectedStat.gamemode);
		const translatedObjectiveName: string = translate(selectedStat.objective);
		const graphName = `[${translatedGamemodeName}] ${translatedObjectiveName}`;

		content = (
			<div className="stat-content">
				<StatGraph name={graphName} data={teamStats} metric="mean"/>
				<div className="stat-table-wrapper">
					<StatTable data={teamStats}/>
				</div>
			</div>
		);
	}

	return (
		<div className="page stat-page">
			<div className="stat-list-wrapper">
				<StatList
					stats={stats}
					selectedStat={selectedStat}
					selectStat={_selectStat}
				/>
			</div>
			{ content }
		</div>
	);
}

const StatPage = connect(inputs, outputs)(ConnectedStatPage);
export default StatPage;
