import { useUsernameSelector } from '../../../state';
import React, { CSSProperties } from 'react';
import './ProfileCard.scss';
import {
	IEventInfo,
	IUserInfo
} from '@gearscout/models';

interface IProps {
	sx?: CSSProperties;
	user: IUserInfo;
	selectedEvent: IEventInfo;
}

export default function ProfileCard(props: IProps) {

	const username: string = useUsernameSelector();

	return (
		<div className="profile-card" style={ props.sx }>
			<div className="username">{ props.user.username }</div>
			<div className="team-number">#{ props.user.teamNumber }</div>
			{
				props.selectedEvent && (
					<div className="event-code">
						{ props.selectedEvent.gameYear }&nbsp;-&nbsp;{ props.selectedEvent.eventCode }
					</div>
				)
			}
		</div>
	);

}
