import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { TeamObjectiveStats } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	data: TeamObjectiveStats[]
}

export default function StatTable({ data }: IProps) {

	const translate = useTranslator();

	const rows = data.map((teamData: TeamObjectiveStats) => (
		<TableRow key={teamData.teamNumber}>
			<TableCell align="right">{ teamData.teamNumber }</TableCell>
			<TableCell align="right">{ teamData.mean }</TableCell>
			<TableCell align="right">{ teamData.median }</TableCell>
			<TableCell align="right">{ teamData.mode }</TableCell>
		</TableRow>
	));

	return (
		<TableContainer>
			<Table aria-label={ translate('STATS_TABLE') }>
				<TableHead>
					<TableRow>
						<TableCell
							className="stat-table-cell"
							align="right"
						>
							{ translate('TEAM_NUMBER') }
						</TableCell>
						<TableCell
							className="stat-table-cell"
							align="right"
						>
							{ translate('MEAN') }
						</TableCell>
						<TableCell
							className="stat-table-cell"
							align="right"
						>
							{ translate('MEDIAN') }
						</TableCell>
						<TableCell
							className="stat-table-cell"
							align="right"
						>
							{ translate('MODE') }
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{ rows }
				</TableBody>
			</Table>
		</TableContainer>
	);
}