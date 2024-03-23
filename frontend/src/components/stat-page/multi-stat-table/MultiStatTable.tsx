import React from 'react';
import { useTranslator } from '../../../service/TranslateService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ObjectiveDescriptor, Team, TeamObjectiveStats } from '../../../models';
import { roundToDecimal } from '../../../service/DisplayUtility';

type MetricType = 'mean' | 'median' | 'mode';

const getSumOfObjectives = (
	robot: Team,
	selectedObjectives: ObjectiveDescriptor[],
	metric: MetricType
): number => {
	return selectedObjectives
		.map((objective: ObjectiveDescriptor) => robot.stats.get(objective.gamemode)?.get(objective.objective))
		.filter((stats: TeamObjectiveStats) => !!stats)
		.map((stats: TeamObjectiveStats) => stats[metric])
		.reduce((previous: number, current: number) => previous + current, 0);
};

interface IProps {
	robots: Team[];
	selectedObjectives: ObjectiveDescriptor[];
	metric: MetricType;
}

export default function MultiStatTable(props: IProps) {

	const translate = useTranslator();

	const rows = [];
	for (const robot of props.robots) {
		const total: number = getSumOfObjectives(robot, props.selectedObjectives, props.metric);
		const columns = props.selectedObjectives.map((descriptor: ObjectiveDescriptor) => {
			const key = descriptor.gamemode + '\0' + descriptor.objective;
			const value: number = robot.stats
				.get(descriptor.gamemode)
				?.get(descriptor.objective)
				?.[props.metric]
				?? 0;
			return (
				<TableCell key={ key } align="right">{ roundToDecimal(value) }</TableCell>
			);
		});

		rows.push(
			<TableRow key={ robot.id }>
				<TableCell align="left">{ robot.id }</TableCell>
				<TableCell align="right">{ roundToDecimal(total) }</TableCell>
				{ columns }
			</TableRow>
		);
	}

	return (
		<TableContainer>
			<Table aria-label={ translate('STATS_TABLE') }>
				<EnhancedTableHead selectedObjectives={ props.selectedObjectives } />
				<TableBody>
					{ rows }
				</TableBody>
			</Table>
		</TableContainer>
	);
}

interface ITableHeadProps {
	selectedObjectives: ObjectiveDescriptor[];
}

function EnhancedTableHead(props: ITableHeadProps) {
	const translate = useTranslator();

	const columns = props.selectedObjectives.map((descriptor: ObjectiveDescriptor) => (
		<TableCell
			key={ descriptor.gamemode + '\0' + descriptor.objective }
			className="multi-stat-table-cell"
			align="right"
		>
			[{ translate(descriptor.gamemode) }] { translate(descriptor.objective) }
		</TableCell>
	));

	return (
		<TableHead>
			<TableRow>
				<TableCell
					className="multi-stat-table-cell"
					align="left"
				>
					{ translate('TEAM_NUMBER') }
				</TableCell>
				<TableCell
					className="multi-stat-table-cell"
					align="right"
				>
					{ translate('TOTAL') }
				</TableCell>
				{ columns }
			</TableRow>
		</TableHead>
	);
}
