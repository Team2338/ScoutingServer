import React, { ReactElement } from 'react';
import './StatGraphStacked.scss';
import { ObjectiveDescriptor, STAT_GRAPH_COLORS, Team, TeamObjectiveStats } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { Tooltip } from '@mui/material';
import { roundToDecimal } from '../../../service/DisplayUtility';

type MetricType = 'mean' | 'median' | 'mode';
interface IProps {
	robots: Team[];
	selectedObjectives: ObjectiveDescriptor[];
	metric: MetricType;
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


export default function StatGraphStacked({ robots, selectedObjectives, metric }: IProps) {

	const translate = useTranslator();

	console.log('Selections', selectedObjectives);
	const sortedRobots: Team[] = robots.slice()
		.sort((a: Team, b: Team) => compareByObjectiveSum(a, b, selectedObjectives, metric));
	const maxScore: number = getSumOfObjectives(sortedRobots[0], selectedObjectives, metric);

	const teamLabels = sortedRobots.map(createTeamLabel);
	const teamBars = sortedRobots
		.map((robot: Team) => createStackedBars(robot, selectedObjectives, metric, maxScore, translate));

	return (
		<div className="stat-graph-stacked">
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

const createStackedBars = (
	robot: Team,
	selectedObjectives: ObjectiveDescriptor[],
	metric: MetricType,
	maxScore: number,
	translate: (key: string) => string
) => {
	const bars: ReactElement[] = [];
	const tooltipLines: ReactElement[] = [];
	const scoreSum: number = getSumOfObjectives(robot, selectedObjectives, metric);

	for (const descriptor of selectedObjectives) {
		const objective: TeamObjectiveStats = robot.stats.get(descriptor.gamemode)?.get(descriptor.objective);
		const score: number = objective ? objective[metric] : 0;
		const barStyle = {
			height: 100 * score / maxScore + '%',
			backgroundColor: STAT_GRAPH_COLORS[bars.length % STAT_GRAPH_COLORS.length]
		};

		const roundedScore: number = roundToDecimal(score);
		const elementKey: string = descriptor.gamemode + '\0' + descriptor.objective;
		tooltipLines.push(
			<div key={ elementKey }>
				[{ translate(descriptor.gamemode) }]&nbsp;{ translate(descriptor.objective) }:&nbsp;{ roundedScore }
			</div>
		);

		bars.push(<div key={ elementKey } className="bar" style={ barStyle } />);
	}

	tooltipLines.reverse(); // Reverse so they're displayed in the same order as the bar graph segments
	const tooltipContent = (
		<div>
			<div>{ translate('TEAM') }:&nbsp;{ robot.id }</div>
			<div>{ translate('TOTAL') }:&nbsp;{ roundToDecimal(scoreSum) }</div>
			<div>--------</div>
			{ tooltipLines }
		</div>
	);

	return (
		<Tooltip
			key={ robot.id }
			title={ tooltipContent }
			arrow={ true }
		>
			<div key={ robot.id } className="team-bars">
				{ bars }
			</div>
		</Tooltip>
	);
};
