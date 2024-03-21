import React from 'react';
import './StatGraphStacked.scss';
import { StackedGlobalStats, TeamObjectiveStats } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	data: StackedGlobalStats;
	metric: 'mean' | 'median' | 'mode';
}

export default function StatGraphStacked({ data, metric }: IProps) {

	const translate = useTranslator();

	console.log(data);
	const maxScore: number = data.objectiveNames
		.map((objective: string) => data.robots[0].objectiveStats[objective])
		.map((t: TeamObjectiveStats) => t[metric])
		.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);

	return (
		<div className="stat-graph-stacked">
			StatGraphStacked Component
		</div>
	);
}
