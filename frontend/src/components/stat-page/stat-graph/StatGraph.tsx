import React from 'react';
import { Tooltip, Typography } from '@material-ui/core';

interface IProps {
	name: string;
	data: [
		{
			teamNumber: number;
			score: number;
		}
	];
}

export default function StatGraph({ name, data }: IProps) {

	// Find max score for normalizing graph
	let maxScore = 0;
	for (const entry of data) {
		if (entry.score > maxScore) {
			maxScore = entry.score;
		}
	}

	const bars = [];
	for (let i = 0; i < data.length; i++) {
		const tooltipText = (
			<div>
				<div>Team { data[i].teamNumber }</div>
				<div>Value: { data[i].score }</div>
			</div>
		);

		let bar = (
			<Tooltip key={data[i].teamNumber} title={tooltipText} arrow>
				<div
					className="bar"
					style={{
						height: 100 * data[i].score / maxScore + '%'
					}}
				/>
			</Tooltip>
		);

		bars.push(bar);
	}

	return (
		<div className="stat-graph-wrapper">
			<Typography className="title" variant="h6">{ name }</Typography>
			<div className="content">
				{ bars }
				{/*	Markers */}
			</div>
		</div>
	);
}
