import './StatGraphColored.scss';
import { STAT_GRAPH_COLOR_SCALE_UNKNOWN, ObjectiveDescriptor, StatsFilter, Team, TeamObjectiveStats, GraphColoring, BarAttributes } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { Tooltip } from '@mui/material';
import { roundToDecimal } from '../../../service/DisplayUtility';

type MetricType = 'mean' | 'median' | 'mode';
type Height = 'full' | 'reduced';


interface IProps {
	robots: Team[];
	selectedObjectives: ObjectiveDescriptor[];
	filter: StatsFilter,
	coloring: GraphColoring,
	metric: MetricType;
	height: Height;
	selectRobot: (robotNumber: number) => void;
}

const getSumOfObjectives = (
	robot: Team,
	selectedObjectives: ObjectiveDescriptor[],
	metric: MetricType
): number => {
	return selectedObjectives
		.map((objective: ObjectiveDescriptor) => robot.stats.get(objective.gamemode)?.get(objective.objective))
		.filter((stats: TeamObjectiveStats) => !!stats)
		.map((stats: TeamObjectiveStats) => stats[metric])
		.reduce((previous: number, current: number) => previous + current, 0);
};

const compareByObjectiveSum = (
	a: Team,
	b: Team,
	selectedObjectives: ObjectiveDescriptor[],
	metric: MetricType
): number => {
	return getSumOfObjectives(b, selectedObjectives, metric) - getSumOfObjectives(a, selectedObjectives, metric);
};

export default function StatGraphColored(props: IProps) {
	const translate = useTranslator();

	const sortedRobots: Team[] = props.robots.slice()
		.sort((a: Team, b: Team) => compareByObjectiveSum(a, b, props.selectedObjectives, props.metric));
	const maxScore: number = getSumOfObjectives(sortedRobots[0], props.selectedObjectives, props.metric);

	const teamLabels = sortedRobots.map(createTeamLabel);

	const teamBars = sortedRobots
		.map((robot: Team) => {
			return createBar(props, robot, maxScore, translate);
		});

	return (
		<div className={ 'stat-graph-stacked ' + props.height + '-height' }>
			<div className="content">{ teamBars }</div>
			<div className="team-number-wrapper">{ teamLabels}</div>
		</div>
	);
}

const createTeamLabel = (robot: Team) => {
	return (
		<div key={ robot.id } className="team-number">
			{ robot.id }
		</div>
	);
};

const createBar = (
	props: IProps,
	robot: Team,
	maxScore: number,
	translate: (key: string) => string
) => {
	const scoreSum: number = getSumOfObjectives(robot, props.selectedObjectives, props.metric);

	const elementKey: string = `${robot.id}`;
	const attributes: BarAttributes = props.coloring.attributes[robot.id];

	const barStyle = {
		height: 100 * scoreSum / maxScore + '%',
		backgroundColor: attributes?.color || STAT_GRAPH_COLOR_SCALE_UNKNOWN
	};

	const label = attributes?.label;

	const tooltipContent = (
		<div>
			<div>{ translate('TEAM') }:&nbsp;{ robot.id }</div>
			<div>{ translate('TOTAL') }:&nbsp;{ roundToDecimal(scoreSum) }</div>
			<hr className="tip-divider"/>
			{(label != undefined && label != '') && (
				<div>{ `${translate(props.filter.topic)}: ${label}` }</div>
			)}
		</div>
	);

	return (
		<Tooltip
			key={ robot.id }
			title={ tooltipContent }
			arrow={ true }
		>
			<div key={ robot.id } className="team-bars" onClick={ () => props.selectRobot(robot.id) }>
				<div key={ elementKey } className="bar" style={ barStyle } />
			</div>
		</Tooltip>
	);
}
