import React, { Fragment } from 'react';
import './RobotList.scss';
import {
	AppDispatch,
	selectForm,
	useAppDispatch,
	useAppSelector
} from '../../../state';
import {
	List,
	ListItemButton,
	useMediaQuery
} from '@mui/material';

export default function RobotList() {

	const dispatch: AppDispatch = useAppDispatch();
	const robotNumbers: number[] = useAppSelector(state => state.forms.robots);
	const selectedRobot: number = useAppSelector(state => state.forms.selected);
	const isMobile: boolean = useMediaQuery('(max-width: 700px)');

	const listOptions = robotNumbers.map((robot: number) => (
		<Fragment>
			<ListItemButton
				key={ robot }
				id={ 'robot-list-item-' + robot }
				selected={ robot === selectedRobot }
				onClick={ () => dispatch(selectForm(robot)) }
				sx={{
					paddingTop: '12px',
					paddingBottom: '12px',
					fontWeight: robot === selectedRobot ? 600 : 400,
					borderRadius: '12px',
					width: '100%',
					justifyContent: 'center',
					border: isMobile ? '2px solid #1976d220' : 'none'
				}}
			>
				<span className="robot-list-item__number">{ robot }</span>
			</ListItemButton>
		</Fragment>
	));

	return (
		<List id="robot-list">
			{ listOptions }
		</List>
	);
}
