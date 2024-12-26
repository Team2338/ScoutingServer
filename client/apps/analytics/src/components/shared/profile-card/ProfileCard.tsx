import { useAppSelector, useUsernameSelector } from '../../../state';
import React from 'react';
import './ProfileCard.scss';
import { IEventInfo } from '@gearscout/models';

interface IProps {
	sx?: any;
	onClick?: () => void;
}

export default function ProfileCard(props: IProps) {

	const username: string = useUsernameSelector();
	const selectedEvent: IEventInfo = useAppSelector(state => state.loginV2.selectedEvent);

	// TODO: Convert the div to a button or link for accessibility
	return (
		<div className="profile-card" style={ props.sx } onClick={ props.onClick }>
			<div className="username">{ username }</div>
			<div className="team-number">#{ selectedEvent.teamNumber }</div>
			<div className="event-code">
				{ selectedEvent.gameYear }&nbsp;-&nbsp;{ selectedEvent.eventCode }
			</div>
		</div>
	);

}
