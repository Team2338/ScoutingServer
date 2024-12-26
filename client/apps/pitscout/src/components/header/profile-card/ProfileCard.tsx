import { IEventInfo, IUserInfo } from '@gearscout/models';
import React, { CSSProperties } from 'react';
import './ProfileCard.scss';

interface IProps {
	sx?: CSSProperties;
	user: IUserInfo;
	selectedEvent: IEventInfo | null;
}

export default function ProfileCard(props: IProps) {

	return (
		<div className="profile-card" style={ props.sx }>
			<div className="username">{ props.user.username }</div>
			<div className="team-number">#{ props.user.teamNumber }</div>
			{
				props.selectedEvent && (
					<div className="event-code">
						{ props.selectedEvent.eventCode }
					</div>
				)
			}
		</div>
	);

}
