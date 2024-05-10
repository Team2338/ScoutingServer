import { useAppSelector, useUsernameSelector } from '../../../state';
import React from 'react';
import './ProfileCard.scss';
import { EventInfo } from '../../../models';

interface IProps {
	sx?: any;
}

export default function ProfileCard(props: IProps) {

	const username: string = useUsernameSelector();
	const selectedEvent: EventInfo = useAppSelector(state => state.loginV2.selectedEvent);

	return (
		<div className="profile-card" style={props.sx}>
			<div className="username">{ username }</div>
			<div className="team-number">#{ selectedEvent.teamNumber }</div>
			<div className="event-code">
				{ selectedEvent.gameYear }&nbsp;-&nbsp;{ selectedEvent.eventCode }
			</div>
		</div>
	);

}
