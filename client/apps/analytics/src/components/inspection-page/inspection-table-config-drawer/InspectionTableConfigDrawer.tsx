import React from 'react';
import './InspectionTableConfigDrawer.scss';
import {
	AppDispatch,
	hideInspectionColumn,
	showInspectionColumn,
	useAppDispatch,
	useAppSelector
} from '../../../state';
import { useTranslator } from '../../../service/TranslateService';
import { Checkbox, Drawer, FormControlLabel } from '@mui/material';

interface IProps {
	isOpen: boolean;
	handleClose: () => void;
}

export default function InspectionTableConfigDrawer(props: IProps) {
	const dispatch: AppDispatch = useAppDispatch();
	const translate = useTranslator();
	const columns: string[] = useAppSelector(state => state.inspections.questionNames);
	const hiddenColumns: string[] = useAppSelector(state => state.inspections.hiddenQuestionNames);

	const _hideColumn = (column: string): void => {
		dispatch(hideInspectionColumn(column));
	};

	const _showColumn = (column: string): void => {
		dispatch(showInspectionColumn(column));
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
			<div className="inspection-table-config-drawer__header">
				<h2 className="title">{ translate('SHOW_COLUMNS') }</h2>
			</div>
			<div className="inspection-table-config-drawer__body">
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
