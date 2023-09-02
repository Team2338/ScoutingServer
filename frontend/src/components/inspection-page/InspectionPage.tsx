import React, { useEffect, useState } from 'react';
import './InspectionPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { DetailNote, DetailNoteQuestion, LoadStatus } from '../../models';
import {
	getInspections,
	useAppDispatch,
	useAppSelector
} from '../../state';
import {
	Icon,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import InspectionTableConfigDrawer from './inspection-table-config-drawer/InspectionTableConfigDrawer';

export default function InspectionPage() {
	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const loadStatus: LoadStatus = useAppSelector(state => state.inspections.loadStatus);
	const notes: DetailNote[] = useAppSelector(state => state.inspections.notes);
	const questionNames: string[] = useAppSelector(state => state.inspections.questionNames);
	const hiddenQuestionNames: string[] = useAppSelector(state => state.inspections.hiddenQuestionNames);
	const [isConfigDrawerOpen, setConfigDrawerOpen] = useState<boolean>(false);
	const _loadInspections = () => dispatch(getInspections());

	useEffect(
		() => {
			_loadInspections();
		},
		[dispatch]
	);

	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <main className="inspection-page">{ translate('LOADING') }</main>;
	}

	if (loadStatus === LoadStatus.failed) {
		return <main className="inspection-page">{ translate('FAILED_TO_LOAD_INSPECTIONS') }</main>;
	}

	const isLoadingInBackground: boolean = loadStatus === LoadStatus.loadingWithPriorSuccess;
	const filteredQuestionNames: string[] = questionNames
		.filter((questionName: string) => !hiddenQuestionNames.includes(questionName));

	const headers = filteredQuestionNames.map((question: string) => (
		<TableCell key={ question } align="center">
			{ translate(question) }
		</TableCell>
	));

	const rows = [];
	for (const note of notes) {
		const robotQuestionMap: Map<string, DetailNoteQuestion> = new Map();
		for (const question of note.questions) {
			robotQuestionMap.set(question.question, question);
		}

		const cells = filteredQuestionNames.map((questionName: string) => {
			if (robotQuestionMap.has(questionName)) {
				const question: DetailNoteQuestion = robotQuestionMap.get(questionName);
				return (
					<TableCell key={ questionName } align="center">{ question.answer }</TableCell>
				);
			}

			return (
				<TableCell key={ questionName } align="center">-</TableCell>
			);
		});

		rows.push(
			<TableRow key={ note.robotNumber }>
				<TableCell align="left">{ note.robotNumber }</TableCell>
				{ cells }
			</TableRow>
		);
	}

	return (
		<main className="page inspection-page">
			<div className="controls-area">
				<Typography variant="h6">{ translate('INSPECTIONS') }</Typography>
				<div className="controls">
					<Tooltip title={ translate('REFRESH_DATA') }>
						<IconButton onClick={ _loadInspections }>
							<Icon>refresh</Icon>
						</IconButton>
					</Tooltip>
					<Tooltip title={ translate('TABLE_SETTINGS') }>
						<IconButton onClick={ () => setConfigDrawerOpen(true) }>
							<Icon>settings</Icon>
						</IconButton>
					</Tooltip>
				</div>
			</div>
			<TableContainer>
				<Table aria-label={ translate('INSPECTIONS_TABLE') }>
					<TableHead>
						<TableRow>
							<TableCell align="left">
								{ translate('TEAM_NUMBER') }
							</TableCell>
							{ headers }
						</TableRow>
					</TableHead>
					<TableBody>
						{ rows }
					</TableBody>
				</Table>
			</TableContainer>
			<InspectionTableConfigDrawer
				isOpen={ isConfigDrawerOpen }
				handleClose={ () => setConfigDrawerOpen(false) }
			/>
		</main>
	);
}
