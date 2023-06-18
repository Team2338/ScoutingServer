import { useAppSelector } from '../../../state';
import React from 'react';
import './ProfileCard.scss';

interface IProps {
	sx?: any;
}

export default function ProfileCard(props: IProps) {

	const username: string = useAppSelector(state => state.login.username);
	const teamNumber: number = useAppSelector(state => state.login.teamNumber);
	const eventCode: string = useAppSelector(state => state.login.eventCode);

	return (
		<div className="profile-card" style={props.sx}>
			<div className="username">{ username }</div>
			<div className="team-number">#{ teamNumber }</div>
			<div className="event-code">{ eventCode }</div>
		</div>
	);

}
