import './StatPlot.scss';
import { Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { ObjectiveDescriptor, Team, TeamObjectiveStats } from '../../../models';

type MetricType = 'mean' | 'median' | 'mode';
interface IProps {
	robots: Team[];
	horizontalObjectives: ObjectiveDescriptor[];
	verticalObjectives: ObjectiveDescriptor[];
	metric: MetricType;
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

const reduceToMax = (prev: number, current: number) => Math.max(prev, current);


export default function StatPlot(props: IProps) {
	const horizontalSums: Record<number, number> = useMemo(() => {
		const result = {};
		for (const robot of props.robots) {
			result[robot.id] = getSumOfObjectives(robot, props.horizontalObjectives, props.metric);
		}

		return result;
	}, [props.robots, props.horizontalObjectives, props.metric]);

	const verticalSums: Record<number, number> = useMemo(() => {
		const result = {};
		for (const robot of props.robots) {
			result[robot.id] = getSumOfObjectives(robot, props.verticalObjectives, props.metric);
		}

		return result;
	}, [props.robots, props.verticalObjectives, props.metric]);

	const maxHorizontal: number = useMemo(
		() => Object.values(horizontalSums).reduce(reduceToMax),
		[horizontalSums]
	);
	const maxVertical: number = useMemo(
		() => Object.values(verticalSums).reduce(reduceToMax),
		[verticalSums]
	);

	const points = props.robots.map(robot => (
		<Tooltip
			title={ robot.id }
			key={ robot.id }
		>
			<button
				className="stat-plot-point"
				onClick={ () => props.selectRobot(robot.id) }
				style={{
					bottom: (verticalSums[robot.id] / maxVertical) * 100 + '%',
					left: (horizontalSums[robot.id] / maxHorizontal) * 100 + '%',
				}}
			>
				<span className="stat-plot-point-label">{ robot.id }</span>
			</button>
		</Tooltip>
	));

	return (
		<div className="stat-plot-wrapper">
			<div className="stat-plot-vertical-legend">Objectives</div>
			<div className="stat-plot">
				<div className="stat-plot-inner">
					{ points }
				</div>
			</div>
			<div className="stat-plot-horizontal-legend">Objectives</div>
		</div>
	);
}
