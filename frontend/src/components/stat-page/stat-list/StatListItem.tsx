import React from 'react';
import { Divider, ListItem } from '@material-ui/core';
import { GlobalObjectiveStats } from '../../../models/response.model';
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
			<ListItem
				button
				selected={isSelected}
				onClick={selectStat}
			>
				<div className="stat-list-item">
					<div>{ translate(stat.name) }</div>
					<div>{ translate('MEAN') }: { stat.stats.mean.toFixed(2) }</div>
					<div>{ translate('MEDIAN') }: { stat.stats.median.toFixed(2) }</div>
				</div>
			</ListItem>
			<Divider variant="fullWidth" component="li"/>
		</React.Fragment>
	);
}
