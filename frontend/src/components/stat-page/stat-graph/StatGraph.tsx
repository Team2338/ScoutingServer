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

	// Find max score for normalizing graph
	let maxScore = 0;
	for (const entry of data) {
		if (entry[metric] > maxScore) {
			maxScore = entry[metric];
		}
	}

	const bars = [];
	const teamLabels = [];
	for (let i = 0; i < data.length; i++) {
		const tooltipText = (
			<div>
				<div>{ translate('TEAM') }: { data[i].teamNumber }</div>
				<div>{ translate('VALUE') }: { data[i][metric] }</div>
			</div>
		);

		let bar = (
			<Tooltip key={data[i].teamNumber} title={tooltipText} arrow>
				<div
					className="bar"
					style={{
						height: 100 * data[i][metric] / maxScore + '%'
					}}
				/>
			</Tooltip>
		);
		bars.push(bar);

		let label = <div key={data[i].teamNumber} className="team-number">{ data[i].teamNumber }</div>;
		teamLabels.push(label);
	}

	return (
		<div className="stat-graph-wrapper">
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
