import React from 'react';
import { Divider, List, ListItem } from '@material-ui/core';
import { GlobalObjectiveStats } from '../../../models/response.model';

interface IProps {
	stats: GlobalObjectiveStats[]
}

export default function StatList({ stats }: IProps) {

	const listItems = stats.map((stat: GlobalObjectiveStats, index: number) => {
		const key = stat.gamemode + stat.name;
		const listItem = (
			<ListItem
				button
				key={key}
			>
				<div className="stat-list-item">
					<div>{ stat.gamemode }</div>
					<div>{ stat.name }</div>
					<div>Mean: { stat.stats.mean }</div>
					<div>Median: { stat.stats.median }</div>
				</div>
			</ListItem>
		);

		if (index === 0) {
			return listItem;
		}

		return (
			<React.Fragment key={key}>
				<Divider variant="fullWidth" component="li"/>
				{ listItem }
			</React.Fragment>
		)
	})

	return (
		<List>
			{ listItems }
		</List>
	);

}
