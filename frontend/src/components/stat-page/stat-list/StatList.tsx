import React from 'react';
import { Divider, List, ListItem } from '@material-ui/core';
import { GlobalObjectiveStats } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	stats: GlobalObjectiveStats[];
	selectedStat: {
		gamemode: string;
		objective: string;
	};
	selectStat: (gamemode: string, objective: string) => void
}

export default function StatList({ stats, selectedStat, selectStat }: IProps) {

	const translate = useTranslator();

	const listItems = stats.map((stat: GlobalObjectiveStats, index: number) => {
		const key = stat.gamemode + stat.name;
		const isSelected = selectedStat
			&& selectedStat.gamemode === stat.gamemode
			&& selectedStat.objective === stat.name;

		const listItem = (
			<ListItem
				button
				key={key}
				selected={isSelected}
				onClick={() => selectStat(stat.gamemode, stat.name)}
			>
				<div className="stat-list-item">
					<div>{ translate(stat.gamemode) }</div>
					<div>{ translate(stat.name) }</div>
					<div>{ translate('MEAN') }: { stat.stats.mean.toFixed(2) }</div>
					<div>{ translate('MEDIAN') }: { stat.stats.median.toFixed(2) }</div>
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
