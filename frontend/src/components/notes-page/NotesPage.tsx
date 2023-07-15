import React, { useEffect } from 'react';
import './NotesPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { DetailNote, DetailNoteQuestion, LoadStatus } from '../../models';
import { getDetailNotes, useAppDispatch, useAppSelector } from '../../state';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function NotesPage() {
	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const loadStatus: LoadStatus = useAppSelector(state => state.detailNotes.loadStatus);
	const notes: DetailNote[] = useAppSelector(state => state.detailNotes.notes);
	const questionNames: string[] = useAppSelector(state => state.detailNotes.questionNames);

	useEffect(
		() => {
			dispatch(getDetailNotes());
		},
		[dispatch]
	);

	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <div className="notes-page">{ translate('LOADING') }</div>;
	}

	if (loadStatus === LoadStatus.failed) {
		// TODO: translate this
		return <div className="state-page">{ translate('FAILED_TO_LOAD_NOTES') }</div>;
	}

	const isLoadingInBackground: boolean = loadStatus === LoadStatus.loadingWithPriorSuccess;
	const headers = questionNames.map((question: string) => (
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

		const cells = questionNames.map((questionName: string) => {
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
			<TableContainer>
				{/* TODO: Translate 'NOTES_TABLE' and 'STATS_TABLE' */ }
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
		</div>
	);
}
