import React from 'react';
import {
	GlobalObjectiveStats,
	ObjectiveDescriptor,
	RequestStatus,
	Team,
	TeamObjectiveStats
} from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { selectStat } from '../../state/Actions';
import { useAppDispatch, useAppSelector, useDataInitializer } from '../../state/Hooks';
import StatGraph from './stat-graph/StatGraph';
import StatList from './stat-list/StatList';
import StatTable from './stat-table/StatTable';
import './StatPage.scss';


function StatPage() {
	useDataInitializer();
	const translate = useTranslator();

	// Dispatch
	const dispatch = useAppDispatch();
	const _selectStat = (gamemode: string, objective: string) => dispatch(selectStat(gamemode, objective));

	// Selectors
	const statsLoadStatus: RequestStatus = useAppSelector(state => state.stats.loadStatus);
	const teamData: Team[] = useAppSelector(state => state.teams.data);
	const stats: GlobalObjectiveStats[] = useAppSelector(state => state.stats.data);
	const selectedStat: ObjectiveDescriptor = useAppSelector(state => state.stats.selectedStat);

	if (statsLoadStatus === RequestStatus.none || statsLoadStatus === RequestStatus.loading) {
		return <div className="stat-page">{ translate('LOADING') }</div>;
	}

	let content = <div>{ translate('SELECT_STAT_VIEW_MORE_DETAILS') }</div>;
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

export default StatPage;
