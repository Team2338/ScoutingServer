import React from 'react';
import { Divider, ListItemButton } from '@mui/material';
import { GlobalObjectiveStats } from '../../../models/response.model';
import { roundToDecimal } from '../../../service/DisplayUtility';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	stat: GlobalObjectiveStats,
	isSelected: boolean,
	selectStat: () => void
}

export default function StatListItem({ stat, isSelected, selectStat }: IProps) {
	const translate = useTranslator();

	return (
		<React.Fragment>
			<ListItemButton
				selected={isSelected}
				onClick={selectStat}
			>
				<div className="stat-list-item">
					<div>{ translate(stat.name) }</div>
					<div>{ translate('MEAN') }: { stat.stats.mean.toFixed(2) }</div>
					<div>{ translate('MEDIAN') }: { roundToDecimal(2) }</div>
				</div>
			</ListItemButton>
			<Divider variant="fullWidth" component="li"/>
		</React.Fragment>
	);
}
