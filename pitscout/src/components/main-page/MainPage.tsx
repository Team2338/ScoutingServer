import React from 'react';
import './MainPage.scss';
import { selectForm, useAppDispatch, useAppSelector } from '../../state';
import DetailNoteForm from './detail-note-form/DetailNoteForm';

export default function MainPage() {

	const dispatch = useAppDispatch();
	const robotNumbers: number[] = useAppSelector(state => state.forms.robots);
	const selectedRobot: number = useAppSelector(state => state.forms.selected?.robotNumber);

	const listOptions = robotNumbers.map((robot: number) => (
		<div
			className="robot-list-item"
			key={ robot }
			onClick={ () => dispatch(selectForm(robot)) }
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
			<DetailNoteForm/>
		</div>
	);
}
