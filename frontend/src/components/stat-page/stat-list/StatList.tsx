import React from 'react';
import { List, Typography } from '@mui/material';
import { GlobalObjectiveStats } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import StatListSection from './StatListSection';

interface IProps {
	stats: GlobalObjectiveStats[];
	selectedStat: {
		gamemode: string;
		objective: string;
	};
	selectStat: (gamemode: string, objective: string) => void;
}

export default function StatList({ stats, selectedStat, selectStat }: IProps) {

	const translate = useTranslator();

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
		<React.Fragment>
			<Typography
				variant="h6"
				sx={{
					margin: '16px 16px 0 16px'
				}}
			>
				{ translate('STATS') }
			</Typography>
			<List
				sx={{
					paddingTop: 0
				}}
			>
				{ listItems }
			</List>
		</React.Fragment>
	);
}
