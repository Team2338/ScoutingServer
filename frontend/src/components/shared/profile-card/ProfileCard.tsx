import { useAppSelector } from '../../../state';
import React from 'react';
import './ProfileCard.scss';

interface IProps {
	sx?: any;
}

export default function ProfileCard(props: IProps) {

	const username: string = useAppSelector(state => state.username);
	const teamNumber: number = useAppSelector(state => state.teamNumber);
	const eventCode: string = useAppSelector(state => state.eventCode);

	return (
		<div className="profile-card" style={props.sx}>
			<div className="username">{ username }</div>
			<div className="team-number">#{ teamNumber }</div>
			<div className="event-code">{ eventCode }</div>
		</div>
	);

}