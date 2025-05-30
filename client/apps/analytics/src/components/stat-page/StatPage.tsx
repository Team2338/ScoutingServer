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
import StatPlot from './stat-plot/StatPlot';
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
	ScatterPlot,
	StackedBarChart,
	TableChart,
	TableRows
} from '@mui/icons-material';

enum ViewType {
	barGraph = 'barGraph',
	table = 'table',
	barGraphTable = 'barGraphTable',
	scatterPlot = 'scatterPlot',
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
	const secondarySelectedStats: ObjectiveDescriptor[] = useAppSelector(state => state.stats.secondarySelectedStats);

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

	let content = (
		<div className="view-more-details-container">
			<span>{ translate('SELECT_STAT_VIEW_MORE_DETAILS') }</span>
			<ViewTypePicker viewType={ viewType } setViewType={ setViewType } />
		</div>
	);
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
				<div className="stat-content-top-row">
					<h2 className="stat-content-title">{ contentTitleText }</h2>
					<ViewTypePicker viewType={ viewType } setViewType={ setViewType } />
				</div>
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
				{ (viewType === ViewType.scatterPlot) && (
					<StatPlot
						robots={ teamData }
						horizontalObjectives={ selectedStats }
						verticalObjectives={ secondarySelectedStats }
						metric="mean"
						selectRobot={ selectRobot }
					/>
				)}
			</div>
		);
	}

	return (
		<Fragment>
			<main className="page stat-page">
				<StatList
					className="stat-list-wrapper"
					variant={ viewType === ViewType.scatterPlot ? 'double' : 'single' }
					stats={ stats }
					selectedStats={ selectedStats }
					secondarySelectedStats={ secondarySelectedStats }
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

function ViewTypePicker(props: { viewType: ViewType, setViewType: (next: ViewType) => void }) {
	/*TODO: Translate below*/
	return (
		<ToggleButtonGroup
			size="small"
			exclusive={ true }
			value={ props.viewType }
			onChange={ (_, next: ViewType) => props.setViewType(next) }
			aria-label="Page layout"
			sx={{ display: 'block', marginBottom: '8px' }}
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
			<ToggleButton value={ ViewType.scatterPlot } aria-label="Scatter plot">
				<ScatterPlot />
			</ToggleButton>
		</ToggleButtonGroup>
	);
}

export default StatPage;
