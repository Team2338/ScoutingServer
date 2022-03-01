import React from 'react';
import { ListSubheader } from '@material-ui/core';
import { GlobalObjectiveStats } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';
import StatListItem from './StatListItem';

interface IProps {
	gamemode: string,
	stats: GlobalObjectiveStats[],
	selectedStat: {
		gamemode: string,
		objective: string
	},
	selectStat: (objective: string) => void
}

export default function StatListSection({ gamemode, stats, selectedStat, selectStat }: IProps) {
	const translate = useTranslator();

	const items = stats.map((stat: GlobalObjectiveStats) => {
		const isSelected = selectedStat
			&& selectedStat.gamemode === stat.gamemode
			&& selectedStat.objective === stat.name;

		return (
			<StatListItem
				key={stat.name}
				stat={stat}
				isSelected={isSelected}
				selectStat={() => selectStat(stat.name)}
			/>
		);
	});

	return (
		<React.Fragment>
			<ListSubheader>{ translate(gamemode) }</ListSubheader>
			{ items }
		</React.Fragment>
	);
}
