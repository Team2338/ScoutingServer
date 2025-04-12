import React, { Fragment, useEffect, useState } from 'react';
import {
	GlobalObjectiveStats,
	ObjectiveDescriptor,
	Statelet,
	Team,
	TeamObjectiveStats
} from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { getComments, getInspections, useAppDispatch, useAppSelector, useDataInitializer } from '../../state';
import StatList from './stat-list/StatList';
import StatTable from './stat-table/StatTable';
import './StatPage.scss';
import DataFailure from '../shared/data-failure/DataFailure';
import TeamDetailModal from '../shared/team-detail-modal/TeamDetailModal';
import StatGraphStacked from './stat-graph-stacked/StatGraphStacked';
import MultiStatTable from './multi-stat-table/MultiStatTable';
import { LoadStatus } from '@gearscout/models';
import {
	ToggleButton,
	ToggleButtonGroup
} from '@mui/material';
import {
	StackedBarChart,
	TableChart,
	TableRows
} from '@mui/icons-material';

enum ViewType {
	barGraph = 'barGraph',
	table = 'table',
	barGraphTable = 'barGraphTable'
}

function StatPage() {
	useDataInitializer();

	const translate = useTranslator();
	const dispatch = useAppDispatch();

	useEffect(
		() => {
			dispatch(getComments());
			dispatch(getInspections());
		},
		[dispatch]
	);

	const [selectedRobotNumber, setSelectedRobotNumber]: Statelet<number> = useState(null);
	const [isTeamDetailOpen, setTeamDetailOpen]: Statelet<boolean> = useState(false);
	const [viewType, setViewType] = useState(ViewType.barGraphTable); // TS complains later on when Statelet is explicit

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
				{/*TODO: Translate below*/}
				<ToggleButtonGroup
					exclusive={ true }
					value={ viewType }
					onChange={ (_, next: ViewType) => setViewType(next) }
					aria-label="Page layout"
				>
					<ToggleButton value={ ViewType.barGraph } aria-label="Bar graph only">
						<StackedBarChart />
					</ToggleButton>
					<ToggleButton value={ ViewType.table } aria-label="Table only">
						<TableRows />
					</ToggleButton>
					<ToggleButton value={ ViewType.barGraphTable } aria-label="Bar graph and table">
						<TableChart />
					</ToggleButton>
				</ToggleButtonGroup>
				{ (viewType === ViewType.barGraph || viewType === ViewType.barGraphTable) && (
					<StatGraphStacked
						robots={ teamData }
						selectedObjectives={ selectedStats }
						metric="mean"
						height={ viewType === ViewType.barGraph ? 'full' : 'reduced' }
						selectRobot={ selectRobot }
					/>
				)}
				{ (viewType === ViewType.table || viewType === ViewType.barGraphTable) && (
					<div className="stat-table-wrapper">
						{
							selectedStats.length > 1
								? <MultiStatTable robots={ teamData } selectedObjectives={ selectedStats } metric="mean" />
								: <StatTable data={ teamStats }/>
						}
					</div>
				)}
			</div>
		);
	}

	return (
		<Fragment>
			<main className="page stat-page">
				<StatList
					className="stat-list-wrapper"
					stats={ stats }
					selectedStats={ selectedStats }
				/>
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
