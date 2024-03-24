import React from 'react';
import { Button, List } from '@mui/material';
import { GlobalObjectiveStats, ObjectiveDescriptor } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import StatListSection from './StatListSection';
import { addSelectedStat, clearSelectedStats, removeSelectedStat, selectStat, useAppDispatch } from '../../../state';

interface IProps {
	stats: GlobalObjectiveStats[];
	selectedStats: ObjectiveDescriptor[];
}

export default function StatList({ stats, selectedStats }: IProps) {

	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const _setSelectedStat = (gamemode: string, objective: string) => dispatch(selectStat(gamemode, objective));
	const _addSelectedStat = (gamemode: string, objective: string) => dispatch(addSelectedStat(gamemode, objective));
	const _removeSelectedStat = (gamemode: string, objective: string) => dispatch(removeSelectedStat(gamemode, objective));
	const _clearSelectedStats = () => dispatch(clearSelectedStats());

	const statsGroupedByGamemode: Map<string, GlobalObjectiveStats[]> = new Map();
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
				key={ gamemode }
				gamemode={ gamemode }
				stats={ objectives }
				selectedStats={ selectedStats }
				selectStat={(objective: string) => _setSelectedStat(gamemode, objective)}
				addSelectedStat={ (objective: string) => _addSelectedStat(gamemode, objective) }
				removeSelectedStat={ (objective: string) => _removeSelectedStat(gamemode, objective) }
			/>
		);
	});

	return (
		<React.Fragment>
			<div className="stat-list-header">
				<h1 className="page-title">{ translate('STATS') }</h1>
				{
					selectedStats.length > 0 &&
					<Button
						id="clear-button"
						variant="text"
						onClick={ _clearSelectedStats }
					>
						{ translate('CLEAR') }
					</Button>
				}
			</div>
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
