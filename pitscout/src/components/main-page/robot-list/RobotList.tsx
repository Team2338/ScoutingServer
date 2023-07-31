import React from 'react';
import './RobotList.scss';
import { AppDispatch, selectForm, useAppDispatch, useAppSelector } from '../../../state';
import { List, ListItemButton } from '@mui/material';

export default function RobotList() {

	const dispatch: AppDispatch = useAppDispatch();
	const robotNumbers: number[] = useAppSelector(state => state.forms.robots);
	const selectedRobot: number = useAppSelector(state => state.forms.selected?.robotNumber);

	const listOptions = robotNumbers.map((robot: number) => (
		<ListItemButton
			key={ robot }
			selected={ robot === selectedRobot }
			onClick={ () => dispatch(selectForm(robot)) }
			sx={{
				paddingTop: '12px',
				paddingBottom: '12px'
			}}
		>
			<span className="robot-list-item__number">{ robot }</span>
		</ListItemButton>
	));

	return (
		<List>
			{ listOptions }
		</List>
	);
}
