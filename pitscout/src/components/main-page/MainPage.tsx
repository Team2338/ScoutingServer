import React from 'react';
import './MainPage.scss';
import { selectForm, useAppDispatch, useAppSelector } from '../../state';
import { TextField } from '@mui/material';

export default function MainPage() {

	const dispatch = useAppDispatch();
	const robotNumbers: number[] = useAppSelector(state => state.forms.robots);
	const selectedRobot: number = useAppSelector(state => state.forms.selected.robotNumber);

	const listOptions = robotNumbers.map((robot: number) => (
		<div
			className="robot-list-item"
			key={ robot }
			onClick={() => dispatch(selectForm(robot))}
		>
			<div className="robot-list-item__number">{ robot }</div>
		</div>
	));


	return (
		<div className="main-page">
			<div className="robot-list">
				<div role="button" className="robot-list-add">Add robot</div>
				{ listOptions }
			</div>
			<form className="robot-form">
				<h1 className="robot-form__robot-number"></h1>
				<TextField
					autoComplete="false"
					label="Describe auto paths"
				></TextField>
			</form>
		</div>
	);
}
