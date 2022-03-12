import './StatGraph.scss';
import React from 'react';
import { Tooltip, Typography } from '@material-ui/core';
import { TeamObjectiveStats } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	name: string;
	data: TeamObjectiveStats[];
	metric: 'mean' | 'median' | 'mode';
}

export default function StatGraph({ name, data, metric }: IProps) {

	const translate = useTranslator();

	console.log(data);
	// Find max score for normalizing graph
	let maxScore = 0;
	for (const entry of data) {
		if (entry[metric] > maxScore) {
			maxScore = entry[metric];
		}
	}

	// Sort by metric, ascending
	const sortedData = data.slice().sort((a: TeamObjectiveStats, b: TeamObjectiveStats) => b[metric] - a[metric]);

	const bars = [];
	const teamLabels = [];
	for (const team of sortedData) {
		const tooltipText = (
			<div>
				<div>{ translate('TEAM') }: { team.teamNumber }</div>
				<div>{ translate('VALUE') }: { team[metric] }</div>
			</div>
		);

		let bar = (
			<Tooltip key={team.teamNumber} title={tooltipText} arrow>
				<div
					className="bar"
					style={{
						height: 100 * team[metric] / maxScore + '%'
					}}
				/>
			</Tooltip>
		);

		bars.push(bar);

		let label = <div key={team.teamNumber} className="team-number">{ team.teamNumber }</div>;
		teamLabels.push(label);
	}

	return (
		<div className="stat-graph">
			<Typography className="title" variant="h6">{ name }</Typography>
			<div className="content">
				{ bars }
				{/*	Markers */}
			</div>
			<div className="team-number-wrapper">
				{ teamLabels }
			</div>
		</div>
	);
}
