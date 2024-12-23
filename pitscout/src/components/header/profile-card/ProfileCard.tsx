import { useAppSelector } from '../../../state';
import React from 'react';
import './ProfileCard.scss';
import { IEventInfo, IUserInfo } from '../../../models';

interface IProps {
	sx?: any;
	onClick?: () => void;
}

export default function ProfileCard(props: IProps) {

	const user: IUserInfo = useAppSelector(state => state.loginv2.user);
	const selectedEvent: IEventInfo = useAppSelector(state => state.events.selectedEvent);

	// TODO: Convert the div to a button or link for accessibility
	return (
		<div className="profile-card" style={ props.sx } onClick={ props.onClick }>
			<div className="username">{ user.username }</div>
			<div className="team-number">#{ user.teamNumber }</div>
			{
				selectedEvent && (
					<div className="event-code">
						{ selectedEvent.eventCode }
					</div>
				)
			}
		</div>
	);

}
