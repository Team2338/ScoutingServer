import React, { useEffect, useState } from 'react';
import './InspectionPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { DetailNote, DetailNoteQuestion, LoadStatus } from '../../models';
import {
	getDetailNotes,
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
	const loadStatus: LoadStatus = useAppSelector(state => state.detailNotes.loadStatus);
	const notes: DetailNote[] = useAppSelector(state => state.detailNotes.notes);
	const questionNames: string[] = useAppSelector(state => state.detailNotes.questionNames);
	const hiddenQuestionNames: string[] = useAppSelector(state => state.detailNotes.hiddenQuestionNames);
	const [isConfigDrawerOpen, setConfigDrawerOpen] = useState<boolean>(false);
	const _loadInspections = () => dispatch(getDetailNotes());

	useEffect(
		() => {
			_loadInspections();
		},
		[dispatch]
	);

	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <div className="inspection-page">{ translate('LOADING') }</div>;
	}

	if (loadStatus === LoadStatus.failed) {
		return <div className="inspection-page">{ translate('FAILED_TO_LOAD_INSPECTIONS') }</div>;
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
		<div className="page inspection-page">
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
		</div>
	);
}
