import React from 'react';
import './NotesTableConfigDrawer.scss';
import { AppDispatch, hideNotesColumn, showNotesColumn, useAppDispatch, useAppSelector } from '../../../state';
import { useTranslator } from '../../../service/TranslateService';
import { Checkbox, Drawer, FormControlLabel, Typography } from '@mui/material';

interface IProps {
	isOpen: boolean;
	handleClose: () => void;
}

export default function NotesTableConfigDrawer(props: IProps) {
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
			<div className="notes-table-config-drawer__header">
				<Typography variant="h6">{ translate('SHOW_COLUMNS') }</Typography>
			</div>
			<div className="notes-table-config-drawer__body">
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
