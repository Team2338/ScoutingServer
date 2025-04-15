import React from 'react';
import { Button, List } from '@mui/material';
import {
	GAMEMODE_ORDERING,
	GlobalObjectiveStats,
	ObjectiveDescriptor
} from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import StatListSection from './StatListSection';
import {
	addSecondarySelectedStat,
	addSelectedStat,
	clearSelectedStats,
	removeSecondarySelectedStat,
	removeSelectedStat,
	selectStat,
	useAppDispatch
} from '../../../state';

interface IProps {
	className?: string;
	variant: 'single' | 'double';
	stats: GlobalObjectiveStats[];
	selectedStats: ObjectiveDescriptor[];
	secondarySelectedStats: ObjectiveDescriptor[];
}

export default function StatList({ className, variant, stats, selectedStats, secondarySelectedStats }: IProps) {

	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const _setSelectedStat = (gamemode: string, objective: string) => dispatch(selectStat(gamemode, objective));
	const _addSelectedStat = (gamemode: string, objective: string) => dispatch(addSelectedStat(gamemode, objective));
	const _removeSelectedStat = (gamemode: string, objective: string) => dispatch(removeSelectedStat(gamemode, objective));
	const _addSecondaryStat = (gamemode: string, objective: string) => dispatch(addSecondarySelectedStat(gamemode, objective));
	const _removeSecondaryStat = (gamemode: string, objective: string) => dispatch(removeSecondarySelectedStat(gamemode, objective));
	const _clearSelectedStats = () => dispatch(clearSelectedStats());

	const statsGroupedByGamemode: Map<string, GlobalObjectiveStats[]> = new Map();
	for (const stat of stats) {
		if (!statsGroupedByGamemode.has(stat.gamemode)) {
			statsGroupedByGamemode.set(stat.gamemode, []);
		}

		statsGroupedByGamemode.get(stat.gamemode).push(stat);
	}

	const listItems = Array.from(statsGroupedByGamemode.keys())
		// .toArray() // Not yet implemented in Safari...
		.toSorted((a: string, b: string) => (GAMEMODE_ORDERING[a] ?? a).localeCompare(GAMEMODE_ORDERING[b] ?? b))
		.map((gamemode: string) => {
			const objectives: GlobalObjectiveStats[] = statsGroupedByGamemode.get(gamemode);
			return (
				<StatListSection
					key={ gamemode }
					variant={ variant }
					gamemode={ gamemode }
					stats={ objectives }
					selectedStats={ selectedStats }
					selectStat={(objective: string) => _setSelectedStat(gamemode, objective)}
					addSelectedStat={ (objective: string) => _addSelectedStat(gamemode, objective) }
					removeSelectedStat={ (objective: string) => _removeSelectedStat(gamemode, objective) }
					secondarySelectedStats={ secondarySelectedStats }
					addSecondarySelectedStat={ (objective: string) => _addSecondaryStat(gamemode, objective) }
					removeSecondarySelectedStat={ (objective: string) => _removeSecondaryStat(gamemode, objective) }
				/>
			);
		});

	return (
		<div className={ `_stat-list ${ className ?? '' }` }>
			<div className="stat-list-header">
				<h2 className="page-title">{ translate('STATS') }</h2>
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
			<List sx={{ paddingTop: 0 }}>
				{ listItems }
			</List>
		</div>
	);
}
