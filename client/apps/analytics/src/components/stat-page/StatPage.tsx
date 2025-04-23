import React, { Fragment, useEffect, useState } from 'react';
import {
	GlobalObjectiveStats,
	Inspection,
	ObjectiveDescriptor,
	Statelet,
	ViewType,
	StatsFilterType,
	Team,
	TeamObjectiveStats,
	CommentsForEvent,
	StatsFilter,
	STAT_GRAPH_COLOR_SCALE_1,
	STAT_GRAPH_COLORS,
	STAT_GRAPH_COLOR_SCALE_UNKNOWN,
	GraphColoring,
	BarAttributes,
	GAMEMODE_ORDERING
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
	TableRows,
} from '@mui/icons-material';
import StatGraphColored from './stat-graph-colored/StatGraphColored';
import FilterPicker from './filter-picker/FilterPicker';

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
	const [statsFilter, setStatsFilter] = useState({
		filterType: StatsFilterType.none,
		topic: '',
		query: ''
	});

	// Selectors
	const statsLoadStatus: LoadStatus = useAppSelector(state => state.stats.loadStatus);
	const teamData: Team[] = useAppSelector(state => state.teams.data);
	const stats: GlobalObjectiveStats[] = useAppSelector(state => state.stats.data);
	const selectedStats: ObjectiveDescriptor[] = useAppSelector(state => state.stats.selectedStats);
	const secondarySelectedStats: ObjectiveDescriptor[] = useAppSelector(state => state.stats.secondarySelectedStats);

	const inspections: Inspection[] = useAppSelector(state => state.inspections.inspections);
	const questions: string[] = useAppSelector(state => state.inspections.questionNames);
	const comments: CommentsForEvent = useAppSelector(state => state.comments.comments);

	const commentTopics = Array.from(new Set(
		Object.values(comments).flatMap(
			(commentsForRobot) => Object.keys(commentsForRobot)
		)
	));

	const statsTopicsMap = Object.fromEntries(stats.map((stat) => {
		const label = `[${translate(stat.gamemode)}]: ${translate(stat.name)}`;
		return [label, stat];
	}));

	const statTopics = Object.keys(statsTopicsMap).sort((a, b) => {
		const aa = statsTopicsMap[a];
		const bb = statsTopicsMap[b];
		const cmpGamemode = (GAMEMODE_ORDERING[aa.gamemode] ?? aa.gamemode).localeCompare(
			GAMEMODE_ORDERING[bb.gamemode] ?? bb.gamemode
		);

		if (cmpGamemode != 0) {
			return cmpGamemode;
		}

		return translate(aa.name).localeCompare(translate(bb.name));
	});

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

	const showScatter = viewType === ViewType.scatterPlot;
	const showBarGraph = viewType === ViewType.barGraph
		|| viewType === ViewType.barGraphTable;
	const showTable = viewType === ViewType.table
		|| viewType === ViewType.barGraphTable;

	const showStackedBarGraph = showBarGraph
		&& statsFilter.filterType === StatsFilterType.none;
	const showColoredBarGraph = showBarGraph
		&& statsFilter.filterType !== StatsFilterType.none;

	const coloring: GraphColoring =
		statsFilter.filterType === StatsFilterType.comments ? getCommentsColors(teamData, comments, statsFilter) :
		statsFilter.filterType === StatsFilterType.inspection ? getInspectionsColors(teamData, inspections, statsFilter) :
		statsFilter.filterType === StatsFilterType.stats ? getStatsColors(teamData, statsTopicsMap, statsFilter) :
		{ attributes: {}, legend: {} };

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

					<div className="view-picker">
						<FilterPicker
							viewType={ viewType }
							inspectionQuestions={ questions }
							commentTopics={ commentTopics }
							statTopics={ statTopics }
							filter={ statsFilter }
							selectFilter={ setStatsFilter }
						/>

						<ViewTypePicker viewType={ viewType } setViewType={ setViewType } />
					</div>
				</div>
				{ (showStackedBarGraph) && (
					<StatGraphStacked
						robots={ teamData }
						selectedObjectives={ selectedStats }
						metric="mean"
						height={ viewType === ViewType.barGraph ? 'full' : 'reduced' }
						selectRobot={ selectRobot }
					/>
				)}
				

				{ (showColoredBarGraph) && (
					<StatGraphColored
						robots={ teamData }
						selectedObjectives={ selectedStats }
						metric="mean"
						filter={ statsFilter }
						coloring={ coloring }
						height={ viewType === ViewType.barGraph ? 'full' : 'reduced' }
						selectRobot={ selectRobot }
					/>
				)}
				{ (showTable) && (
					<div className="stat-table-wrapper">
						{
							selectedStats.length > 1
								? <MultiStatTable robots={ teamData } selectedObjectives={ selectedStats } metric="mean" />
								: <StatTable data={ teamStats }/>
						}
					</div>
				)}
				{ (showScatter) && (
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

	const statListVariant =
		viewType === ViewType.scatterPlot ? 'double' :
		showColoredBarGraph ? 'single-nokey' :
		'single';

	return (
		<Fragment>
			<main className="page stat-page">
				<StatList
					className="stat-list-wrapper"
					variant={ statListVariant }
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
			onChange={ (_, next: ViewType) => {
				if (next != undefined) {
					props.setViewType(next)
				}
			}}
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

/* comment-based color filtering */
function getCommentsColors(robots: Team[], comments: CommentsForEvent, statsFilter: StatsFilter): GraphColoring {
	console.log("getCommentsColors");
	const colorYes = STAT_GRAPH_COLORS[0];
	const colorNo = STAT_GRAPH_COLORS[1];

	const queries = statsFilter.query.normalize().toLocaleLowerCase().split(',').map(
		(q) => q.trim()
	).filter(
		(q) => q.length > 0
	);

	const attributes: {[k: string]: BarAttributes} = Object.fromEntries(
		robots.map(
			(robot) => {
				const robotComments = comments[robot.id];
				if (robotComments == undefined) {
					// no comments for this robot, color the bar gray
					return [robot.id, { color: STAT_GRAPH_COLOR_SCALE_UNKNOWN, label: '' }];
				}

				const topicComments = robotComments[statsFilter.topic];

				if (topicComments == undefined || topicComments.length == 0) {
					// no comments for this robot, color the bar gray
					return [robot.id, { color: STAT_GRAPH_COLOR_SCALE_UNKNOWN, label: '' }];
				}

				if (queries.length == 0 && topicComments.length > 0) {
					// no search query - any robot with comments matching the selected
					// topic gets a blue bar
					return [robot.id, { color: colorYes, label: '' }];
				}

				const normComments = topicComments.map(
					(comment) => comment.content.normalize().toLocaleLowerCase().trim()
				);

				const matches = queries.flatMap(
					(query) => normComments.map(
						(comment) => comment.includes(query)
					)
				);

				if (matches.indexOf(true) !== -1) {
					return [robot.id, { color: colorYes, label: '✅' }];
				} else {
					return [robot.id, { color: colorNo, label: '❌' }];
				}
			}
		)
	);

	return { attributes, legend: {} };
}

interface InspectionAnswers {
	[k: string]: string
}

/* inspection-based color filtering */
function getInspectionsColors(robots: Team[], inspections: Inspection[], statsFilter: StatsFilter): GraphColoring {
	const answers: InspectionAnswers = Object.fromEntries(
		robots.map((robot: Team) => [robot.id, findInspectionAnswer(robot, statsFilter.topic, inspections)])
	);

	// decide if we should treat this inspection data as numeric
	const numeric = Object.values(answers).map((n) => n === undefined || isNumeric(n)).indexOf(false) === -1;

	if (numeric) {
		return getNumericInspectionsColors(robots, answers);
	} else {
		return getBucketedInspectionsColors(robots, answers);
	}
}

function getNumericInspectionsColors(robots: Team[], answers: InspectionAnswers): GraphColoring {
	var numericAnswers: {[k: string]: number} = {};

	for (let robot of robots) {
		const numeric = parseInt(answers[robot.id]);
		if (!isNaN(numeric)) {
			numericAnswers[robot.id] = numeric;
		}
	}

	const min = Math.min(...Object.values(numericAnswers));
	const max = Math.max(...Object.values(numericAnswers));

	const attributes = Object.fromEntries(
		robots.map(
			(robot) => {
				const value = numericAnswers[robot.id];
				const color = colorScale1(min, value, max);
				const attributes = {
					color,
					label: value?.toString()
				}
				return [robot.id, attributes]
			}
		)
	);

	const legend = {};
	legend[min] = colorScale1(min, min, max);
	legend[max] = colorScale1(min, max, max);

	return { attributes, legend };
}

function getBucketedInspectionsColors(robots: Team[], answers: InspectionAnswers): GraphColoring {
	const uniqueAnswers = Array.from(new Set(Object.values(answers)));
	const legend = {};

	const attributes = Object.fromEntries(
		robots.map(
			(robot) => {
				const answer = answers[robot.id];
				const index = uniqueAnswers.indexOf(answer) % STAT_GRAPH_COLORS.length;
				const color = STAT_GRAPH_COLORS[index];
				legend[answer] = color;
				const attributes = {
					color,
					label: answer
				};
				return [robot.id, attributes];
			}
		)
	);

	return { attributes, legend };
}

function findInspectionAnswer(robot: Team, question: string, inspections: Inspection[]): string {
	const inspection = inspections.find((i) => i.robotNumber === robot.id);
	if (inspection == undefined) {
		return undefined;
	}

	const answer = inspection.questions.find((q) => q.question == question);
	if (answer == undefined) {
		return undefined;
	}

	return answer.answer;
}

/* statistic based color filtering */
function getStatsColors(robots: Team[], stats: {[k: string]: GlobalObjectiveStats}, statsFilter: StatsFilter): GraphColoring {
	const stat = stats[statsFilter.topic];

	if (stat == undefined) {
		return { attributes: {}, legend: {} };
	}

	const min = Math.min(...stat.scores.map((s) => s.mean));
	const max = Math.max(...stat.scores.map((s) => s.mean));

	const attributes = Object.fromEntries(robots.map((robot) => {
		const score = stat.scores
			.find((score) => score.teamNumber == robot.id)
			?.mean;

		if (score == undefined) {
			return [robot.id, { color: STAT_GRAPH_COLOR_SCALE_UNKNOWN, label: '' }]; 
		}

		return [robot.id, { color: colorScale1(min, score, max), label: `${score}` }];
	}));

	const legend = {};
	legend[min] = colorScale1(min, min, max);
	legend[max] = colorScale1(min, max, max);

	return { attributes, legend };
}

function isNumeric(s: any) {
	return !isNaN(s) && !isNaN(parseFloat(s));
}

function colorScale1(min: number, value: number, max: number): string {
	// TODO add support for other color scales?
	const range = max - min;
	const quantile = (value - min) / range;
	const index = Math.min(Math.trunc(quantile * STAT_GRAPH_COLOR_SCALE_1.length), STAT_GRAPH_COLOR_SCALE_1.length - 1);
	return STAT_GRAPH_COLOR_SCALE_1[index];
}

export default StatPage;
