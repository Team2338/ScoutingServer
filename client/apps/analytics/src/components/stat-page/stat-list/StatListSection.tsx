import './StatList.scss';
import React, { useMemo } from 'react';
import { Checkbox, Divider, ListItemButton, ListSubheader } from '@mui/material';
import { GlobalObjectiveStats, ObjectiveDescriptor, STAT_GRAPH_COLORS } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { roundToDecimal } from '../../../service/DisplayUtility';

interface IProps {
	gamemode: string;
	stats: GlobalObjectiveStats[];
	selectedStats: ObjectiveDescriptor[];
	selectStat: (objective: string) => void;
	addSelectedStat: (objective: string) => void;
	removeSelectedStat: (objective: string) => void;
}

export default function StatListSection({ gamemode, stats, selectedStats, selectStat, addSelectedStat, removeSelectedStat }: IProps) {
	const translate = useTranslator();

	const descriptorToColorMap: Map<string, string> = useMemo(() => {
		const map: Map<string, string> = new Map();
		selectedStats.forEach((descriptor, index: number) => {
			const key: string = descriptor.gamemode + '\0' + descriptor.objective;
			map.set(key, STAT_GRAPH_COLORS[index % STAT_GRAPH_COLORS.length]);
		});
		return map;
	}, [selectedStats]);

	const items = stats.map((stat: GlobalObjectiveStats) => {
		const isSelected: boolean = !!selectedStats.find((descriptor: ObjectiveDescriptor) => (
			descriptor.gamemode === stat.gamemode && descriptor.objective === stat.name
		));

		const handleCheckboxClick = (event): void => {
			event.stopPropagation();

			if (event.target.checked) {
				addSelectedStat(stat.name);
				return;
			}

			removeSelectedStat(stat.name);
		};

		return (
			<React.Fragment key={ stat.name }>
				<ListItemButton
					selected={ isSelected }
					onClick={ () => selectStat(stat.name) }
				>
					<div className="stat-list-item">
						<div>{ translate(stat.name) }</div>
						<div>{ translate('MEAN') }: { stat.stats.mean.toFixed(2) }</div>
						<div>{ translate('MEDIAN') }: { roundToDecimal(stat.stats.median) }</div>
					</div>
					{
						descriptorToColorMap.has(stat.gamemode + '\0' + stat.name) &&
						<div
							className="stat-list-color-legend"
							style={{
								backgroundColor: descriptorToColorMap.get(stat.gamemode + '\0' + stat.name)
							}}
						/>
					}

					<Checkbox
						className="stat-list-checkbox"
						checked={ isSelected }
						onChange={ handleCheckboxClick }
						onClick={ (event) => event.stopPropagation() }
						style={{
							opacity: selectedStats.length > 0 ? 1 : 0,
							transition: 'opacity 150ms ease-in-out'
						}}
					/>
				</ListItemButton>
				<Divider variant="fullWidth" component="li"/>
			</React.Fragment>
		);
	});

	return (
		<React.Fragment>
			<ListSubheader sx={{ top: '52px' }}>{ translate(gamemode) }</ListSubheader>
			{ items }
		</React.Fragment>
	);
}
