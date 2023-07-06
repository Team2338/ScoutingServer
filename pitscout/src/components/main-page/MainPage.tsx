import React from 'react';
import './MainPage.scss';
import {useAppSelector} from '../../state';

export default function MainPage() {

	const robotNumbers: number[] = useAppSelector(state => state.forms.robots);

	const listOptions = robotNumbers.map((robot: number) => (
		<div className="robot-list-item" key={ robot }>
			<div className="robot-list-item__number">{ robot }</div>
		</div>
	));

	return (
		<div className="main-page">
			<div className="robot-list">
				{ listOptions }
			</div>
		</div>
	);
}
