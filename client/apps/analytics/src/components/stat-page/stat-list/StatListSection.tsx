import './StatList.scss';
import React, {
	Fragment,
	useMemo
} from 'react';
import { Checkbox, Divider, ListItemButton, ListSubheader } from '@mui/material';
import { GlobalObjectiveStats, ObjectiveDescriptor, STAT_GRAPH_COLORS } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { roundToDecimal } from '../../../service/DisplayUtility';

interface IProps {
	variant: 'single' | 'double';
	gamemode: string;
	stats: GlobalObjectiveStats[];
	selectedStats: ObjectiveDescriptor[];
	selectStat: (objective: string) => void;
	addSelectedStat: (objective: string) => void;
	removeSelectedStat: (objective: string) => void;
	secondarySelectedStats: ObjectiveDescriptor[];
	addSecondarySelectedStat: (objective: string) => void;
	removeSecondarySelectedStat: (objective: string) => void;
}

export default function StatListSection(props: IProps) {
	const translate = useTranslator();

	const descriptorToColorMap: Map<string, string> = useMemo(() => {
		const map: Map<string, string> = new Map();
		props.selectedStats.forEach((descriptor, index: number) => {
			const key: string = descriptor.gamemode + '\0' + descriptor.objective;
			map.set(key, STAT_GRAPH_COLORS[index % STAT_GRAPH_COLORS.length]);
		});
		return map;
	}, [props.selectedStats]);

	const items = props.stats.map((stat: GlobalObjectiveStats) => {
		const isSelected: boolean = !!props.selectedStats.find((descriptor: ObjectiveDescriptor) => (
			descriptor.gamemode === stat.gamemode && descriptor.objective === stat.name
		));

		const isSecondarySelected: boolean =
			props.variant === 'double'
			&& !!props.secondarySelectedStats.find((descriptor: ObjectiveDescriptor) => (
				descriptor.gamemode === stat.gamemode && descriptor.objective === stat.name
			));

		const handleCheckboxClick = (event): void => {
			event.stopPropagation();

			if (event.target.checked) {
				props.addSelectedStat(stat.name);
				return;
			}

			props.removeSelectedStat(stat.name);
		};

		const handleSecondaryCheckboxClick = (event): void => {
			event.stopPropagation();
			if (event.target.checked) {
				props.addSecondarySelectedStat(stat.name);
				return;
			}

			props.removeSecondarySelectedStat(stat.name);
		};

		return (
			<Fragment key={ stat.name }>
				<ListItemButton
					selected={ isSelected || isSecondarySelected }
					onClick={ () => props.selectStat(stat.name) }
				>
					<div className="stat-list-item">
						<div>{ translate(stat.name) }</div>
						<div>{ translate('MEAN') }: { stat.stats.mean.toFixed(2) }</div>
						<div>{ translate('MEDIAN') }: { roundToDecimal(stat.stats.median) }</div>
					</div>
					{
						(props.variant === 'single' && descriptorToColorMap.has(stat.gamemode + '\0' + stat.name)) &&
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
							opacity: (props.selectedStats.length > 0 || props.variant === 'double') ? 1 : 0,
							transition: 'opacity 150ms ease-in-out'
						}}
					/>
					{ (props.variant === 'double') && (
						<Checkbox
							className="stat-list-checkbox"
							color="secondary"
							checked={ isSecondarySelected }
							onChange={ handleSecondaryCheckboxClick }
							onClick={ (event) => event.stopPropagation() }
						/>
					)}
				</ListItemButton>
				<Divider variant="fullWidth" component="li"/>
			</Fragment>
		);
	});

	return (
		<Fragment>
			<ListSubheader style={{ top: 'var(--stat-header-height)' }}>{ translate(props.gamemode) }</ListSubheader>
			{ items }
		</Fragment>
	);
}
