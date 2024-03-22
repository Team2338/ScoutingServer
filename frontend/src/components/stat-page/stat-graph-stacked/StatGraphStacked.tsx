import React from 'react';
import './StatGraphStacked.scss';
import { ObjectiveDescriptor, Team, TeamObjectiveStats } from '../../../models';
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
	// TODO: need to sort by max score
	const sortedRobots: Team[] = robots.slice()
		.sort((a: Team, b: Team) => compareByObjectiveSum(a, b, selectedObjectives, metric));
	const maxScore: number = getSumOfObjectives(sortedRobots[0], selectedObjectives, metric);
	console.log(maxScore);

	const teamBars = [];
	const teamLabels = [];
	for (const robot of sortedRobots) {
		const label = createTeamLabel(robot);
		teamLabels.push(label);

		const stackedBars = createStackedBars(robot, selectedObjectives, metric, maxScore, translate);
		const teamBar = (
			<div key={ robot.id } className="team-bars">
				{ stackedBars }
			</div>
		);
		teamBars.push(teamBar);
	}

	return (
		<div className="stat-graph-stacked">
			<h2>StatGraphStacked Component</h2>
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
	metric: 'mean' | 'median' | 'mode',
	maxScore: number,
	translate: (key: string) => string
) => {
	const bars = [];
	for (const descriptor of selectedObjectives) {
		const objective: TeamObjectiveStats = robot.stats.get(descriptor.gamemode)?.get(descriptor.objective);
		const score: number = objective ? objective[metric] : 0;
		const barStyle = {
			height: 100 * score / maxScore + '%'
		};

		const roundedScore: number = roundToDecimal(score);
		const tooltipText = (
			<div>
				<div>{ translate('TEAM') }:&nbsp;{ robot.id }</div>
				<div>[{ translate(descriptor.gamemode) }]&nbsp;{ translate(descriptor.objective) }:&nbsp;{ roundedScore }</div>
			</div>
		);

		const bar = (
			<Tooltip key={ descriptor.gamemode + '|' + descriptor.objective } title={ tooltipText } arrow={ true }>
				<div className="bar" style={ barStyle } />
			</Tooltip>
		);

		bars.push(bar);
	}

	return bars;
};
