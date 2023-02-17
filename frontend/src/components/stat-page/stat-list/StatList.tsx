import React from 'react';
import { List } from '@mui/material';
import { GlobalObjectiveStats } from '../../../models/response.model';
import StatListSection from './StatListSection';

interface IProps {
	stats: GlobalObjectiveStats[];
	selectedStat: {
		gamemode: string;
		objective: string;
	};
	selectStat: (gamemode: string, objective: string) => void
}

export default function StatList({ stats, selectedStat, selectStat }: IProps) {

	const statsGroupedByGamemode = new Map<string, GlobalObjectiveStats[]>();
	for (const stat of stats) {
		if (!statsGroupedByGamemode.has(stat.gamemode)) {
			statsGroupedByGamemode.set(stat.gamemode, []);
		}

		statsGroupedByGamemode.get(stat.gamemode).push(stat);
	}

	const listItems = [];
	statsGroupedByGamemode.forEach((objectives: GlobalObjectiveStats[], gamemode: string) => {
		listItems.push(
			<StatListSection
				key={gamemode}
				gamemode={gamemode}
				stats={objectives}
				selectedStat={selectedStat}
				selectStat={(objective: string) => selectStat(gamemode, objective)}
			/>
		);
	});

	return (
		<List>
			{ listItems }
		</List>
	);
}
