import React, { useEffect, useState } from 'react';
import './NotesPage.scss';
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
	Typography
} from '@mui/material';
import NotesTableConfigDrawer from './notes-table-config-drawer/NotesTableConfigDrawer';

export default function NotesPage() {
	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const loadStatus: LoadStatus = useAppSelector(state => state.detailNotes.loadStatus);
	const notes: DetailNote[] = useAppSelector(state => state.detailNotes.notes);
	const questionNames: string[] = useAppSelector(state => state.detailNotes.questionNames);
	const hiddenQuestionNames: string[] = useAppSelector(state => state.detailNotes.hiddenQuestionNames);
	const [isConfigDrawerOpen, setConfigDrawerOpen] = useState<boolean>(false);
	const _loadPitNotes = () => dispatch(getDetailNotes());

	useEffect(
		() => {
			_loadPitNotes();
		},
		[dispatch]
	);

	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <div className="notes-page">{ translate('LOADING') }</div>;
	}

	if (loadStatus === LoadStatus.failed) {
		return <div className="state-page">{ translate('FAILED_TO_LOAD_NOTES') }</div>;
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
				<TableCell key={ questionName } align="left">-</TableCell>
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
		<div className="page notes-page">
			<div className="controls-area">
				<Typography variant="h6">{ translate('NOTES') }</Typography>
				<div className="controls">
					<IconButton onClick={ _loadPitNotes }>
						<Icon>refresh</Icon>
					</IconButton>
					<IconButton onClick={ () => setConfigDrawerOpen(true) }>
						<Icon>settings</Icon>
					</IconButton>
				</div>
			</div>
			<TableContainer>
				<Table aria-label={ translate('NOTES_TABLE') }>
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
			<NotesTableConfigDrawer
				isOpen={ isConfigDrawerOpen }
				handleClose={ () => setConfigDrawerOpen(false) }
			/>
		</div>
	);
}
