import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import React from 'react';
import { TeamObjectiveStats } from '../../../models';
import { roundToDecimal } from '../../../service/DisplayUtility';
import { useTranslator } from '../../../service/TranslateService';

enum Statistic {
	TEAM_NUMBER = 'teamNumber',
	MEAN = 'mean',
	MEDIAN = 'median',
	MODE = 'mode'
}

enum Order {
	ASCENDING = 'asc',
	DESCENDING = 'desc'
}

interface IProps {
	data: TeamObjectiveStats[];
}

export default function StatTable({ data }: IProps) {

	const translate = useTranslator();
	const [orderDirection, setOrderDirection] = React.useState(Order.DESCENDING);
	const [orderProperty, setOrderProperty] = React.useState(Statistic.MEAN);

	const sortedData = data.slice().sort((a: TeamObjectiveStats, b: TeamObjectiveStats) => {
		const comparison = a[orderProperty] - (b[orderProperty]);
		return (orderDirection === Order.ASCENDING) ? comparison : -comparison;
	});

	const handleSort = (property: Statistic) => {
		// Should sort 'descending' if we change properties or were previously 'ascending'
		const nextOrderIsDesc = (orderProperty !== property) || (orderDirection === Order.ASCENDING);
		setOrderDirection(nextOrderIsDesc ? Order.DESCENDING : Order.ASCENDING);
		setOrderProperty(property);
	};

	const rows = sortedData.map((teamData: TeamObjectiveStats) => (
		<TableRow key={teamData.teamNumber}>
			<TableCell align="left">{ teamData.teamNumber }</TableCell>
			<TableCell align="right">{ teamData.mean.toFixed(2) }</TableCell>
			<TableCell align="right">{ roundToDecimal(teamData.median) }</TableCell>
			<TableCell align="right">{ roundToDecimal(teamData.mode) }</TableCell>
		</TableRow>
	));

	return (
		<TableContainer>
			<Table aria-label={ translate('STATS_TABLE') }>
				<EnhancedTableHead
					sortDirection={orderDirection}
					sortProperty={orderProperty}
					onSort={handleSort}
				/>
				<TableBody>
					{ rows }
				</TableBody>
			</Table>
		</TableContainer>
	);
}

interface ITableHeadProps {
	sortDirection: Order;
	sortProperty: Statistic;
	onSort: (property: Statistic) => void;
}

function EnhancedTableHead(props: ITableHeadProps) {
	const translate = useTranslator();

	return (
		<TableHead>
			<TableRow>
				<TableCell
					className="stat-table-cell"
					align="left"
				>
					{ translate('TEAM_NUMBER') }
				</TableCell>
				<TableCell
					className="stat-table-cell"
					align="right"
					sortDirection={props.sortProperty === Statistic.MEAN ? props.sortDirection : false}
				>
					<TableSortLabel
						active={props.sortProperty === Statistic.MEAN}
						direction={props.sortProperty === Statistic.MEAN ? props.sortDirection : Order.ASCENDING}
						onClick={(event) => {
							console.log(event);
							props.onSort(Statistic.MEAN);
						}}
					>
						{ translate('MEAN') }
					</TableSortLabel>
				</TableCell>
				<TableCell
					className="stat-table-cell"
					align="right"
					sortDirection={props.sortProperty === Statistic.MEDIAN ? props.sortDirection : false}
				>
					<TableSortLabel
						active={props.sortProperty === Statistic.MEDIAN}
						direction={props.sortProperty === Statistic.MEDIAN ? props.sortDirection : Order.ASCENDING}
						onClick={() => props.onSort(Statistic.MEDIAN)}
					>
						{ translate('MEDIAN') }
					</TableSortLabel>
				</TableCell>
				<TableCell
					className="stat-table-cell"
					align="right"
					sortDirection={props.sortProperty === Statistic.MODE ? props.sortDirection : false}
				>
					<TableSortLabel
						active={props.sortProperty === Statistic.MODE}
						direction={props.sortProperty === Statistic.MODE ? props.sortDirection : Order.ASCENDING}
						onClick={() => props.onSort(Statistic.MODE)}
					>
						{ translate('MODE') }
					</TableSortLabel>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}
