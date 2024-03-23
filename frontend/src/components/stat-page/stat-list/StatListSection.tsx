import React from 'react';
import { Checkbox, Divider, ListItemButton, ListSubheader } from '@mui/material';
import { GlobalObjectiveStats, ObjectiveDescriptor } from '../../../models';
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
						<div>{ translate('MEDIAN') }: { roundToDecimal(2) }</div>
					</div>
					<Checkbox checked={ isSelected } onChange={ handleCheckboxClick } onClick={ (event) => event.stopPropagation() }/>
				</ListItemButton>
				<Divider variant="fullWidth" component="li"/>
			</React.Fragment>
		);
	});

	return (
		<React.Fragment>
			<ListSubheader>{ translate(gamemode) }</ListSubheader>
			{ items }
		</React.Fragment>
	);
}
