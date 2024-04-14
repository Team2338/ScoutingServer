import React, { Fragment, useState } from 'react';
import {
	GlobalObjectiveStats,
	LoadStatus,
	ObjectiveDescriptor,
	Statelet,
	Team,
	TeamObjectiveStats
} from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { useAppSelector, useDataInitializer } from '../../state';
import StatList from './stat-list/StatList';
import StatTable from './stat-table/StatTable';
import './StatPage.scss';
import DataFailure from '../shared/data-failure/DataFailure';
import TeamDetailModal from '../shared/team-detail-modal/TeamDetailModal';
import StatGraphStacked from './stat-graph-stacked/StatGraphStacked';
import MultiStatTable from './multi-stat-table/MultiStatTable';


function StatPage() {
	useDataInitializer();
	const translate = useTranslator();

	const [selectedRobotNumber, setSelectedRobotNumber]: Statelet<number> = useState(null);
	const [isTeamDetailOpen, setTeamDetailOpen]: Statelet<boolean> = useState(false);

	// Selectors
	const statsLoadStatus: LoadStatus = useAppSelector(state => state.stats.loadStatus);
	const teamData: Team[] = useAppSelector(state => state.teams.data);
	const stats: GlobalObjectiveStats[] = useAppSelector(state => state.stats.data);
	const selectedStats: ObjectiveDescriptor[] = useAppSelector(state => state.stats.selectedStats);

	const selectRobot = (robotNumber: number) => {
		setSelectedRobotNumber(robotNumber);
		setTeamDetailOpen(true);
	};

	const afterClose = () => {
		setSelectedRobotNumber(null);
	};

	if (statsLoadStatus === LoadStatus.none || statsLoadStatus === LoadStatus.loading) {
		return <main className="stat-page">{ translate('LOADING') }</main>;
	}

	if (statsLoadStatus === LoadStatus.failed) {
		return (
			<main className="page stat-page stat-page-failed">
				<DataFailure messageKey="FAILED_TO_LOAD_STATS" />
			</main>
		);
	}

	let content = <div>{ translate('SELECT_STAT_VIEW_MORE_DETAILS') }</div>;
	if (selectedStats.length > 0) {
		const teamStats: TeamObjectiveStats[] = teamData
			.map((team: Team) => team.stats
				?.get(selectedStats[0].gamemode)
				?.get(selectedStats[0].objective)
			)
			.filter((objective: TeamObjectiveStats) => !!objective);

		let contentTitleText: string = translate('COMBINED_STATISTICS');
		if (selectedStats.length === 1) {
			const descriptor: ObjectiveDescriptor = selectedStats[0];
			const translatedGamemodeName: string = translate(descriptor.gamemode);
			const translatedObjectiveName: string = translate(descriptor.objective);
			contentTitleText = `[${ translatedGamemodeName }] ${ translatedObjectiveName }`;
		}

		content = (
			<div className="stat-content">
				<h2 className="stat-content-title">{ contentTitleText }</h2>
				<StatGraphStacked
					robots={ teamData }
					selectedObjectives={ selectedStats }
					metric="mean"
					selectRobot={ selectRobot }
				/>
				<div className="stat-table-wrapper">
					{
						selectedStats.length > 1
							? <MultiStatTable robots={ teamData } selectedObjectives={ selectedStats } metric="mean" />
							: <StatTable data={ teamStats }/>
					}
				</div>
			</div>
		);
	}

	return (
		<Fragment>
			<main className="page stat-page">
				<div className="stat-list-wrapper">
					<StatList
						stats={ stats }
						selectedStats={ selectedStats }
					/>
				</div>
				{ content }
			</main>
			<TeamDetailModal
				isOpen={ isTeamDetailOpen }
				robotNumber={ selectedRobotNumber }
				handleClose={ () => setTeamDetailOpen(false) }
				transition="fade"
				afterClose={ afterClose }
			/>
		</Fragment>
	);
}

export default StatPage;
