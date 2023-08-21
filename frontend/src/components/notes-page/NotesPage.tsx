import React, { useEffect, useState } from 'react';
import './NotesPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { DetailNote, DetailNoteQuestion, LoadStatus } from '../../models';
import {
	AppDispatch,
	getDetailNotes,
	hideNotesColumn,
	showNotesColumn,
	useAppDispatch,
	useAppSelector
} from '../../state';
import {
	Checkbox,
	Drawer,
	FormControlLabel,
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

function NotesTableConfigDrawer(props: {
	isOpen: boolean;
	handleClose: () => void;
}) {
	const dispatch: AppDispatch = useAppDispatch();
	const translate = useTranslator();
	const columns: string[] = useAppSelector(state => state.detailNotes.questionNames);
	const hiddenColumns: string[] = useAppSelector(state => state.detailNotes.hiddenQuestionNames);

	const _hideColumn = (column: string): void => {
		dispatch(hideNotesColumn(column));
	};

	const _showColumn = (column: string): void => {
		dispatch(showNotesColumn(column));
	};

	const handleCheckboxClick = (column: string, isChecked: boolean): void => {
		if (isChecked) {
			_showColumn(column);
			return;
		}

		_hideColumn(column);
	};

	const checkboxes = columns.map((title: string) => (
		<FormControlLabel
			key={ title }
			label={ translate(title) }
			control={
				<Checkbox
					checked={ !hiddenColumns.includes(title) }
					onChange={ (event) => handleCheckboxClick(title, event.target.checked) }
				/>
			}
		/>
	));

	return (
		<Drawer
			anchor="right"
			open={ props.isOpen }
			onClose={ props.handleClose }
		>
			<div className="notes-page-config-drawer__header">
				<Typography variant="h6">Show columns</Typography>
			</div>
			<div className="notes-page-config-drawer__body">
				<FormControlLabel
					key="TEAM_NUMBER"
					label={ translate('TEAM_NUMBER') }
					control={
						<Checkbox
							checked={true}
							disabled={true}
						/>
					}
				/>
				{ checkboxes }
			</div>
		</Drawer>
	);
}
