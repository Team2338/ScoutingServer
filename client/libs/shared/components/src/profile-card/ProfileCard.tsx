import React, {
	CSSProperties,
	Fragment
} from 'react';
import './ProfileCard.scss';
import {
	IEventInfo,
	IUserInfo
} from '@gearscout/models';
import { CalendarMonthRounded } from '@mui/icons-material';

interface IProps {
	sx?: CSSProperties;
	user: IUserInfo;
	selectedEvent?: IEventInfo | null;
}

export function ProfileCard(props: IProps) {

	return (
		<div className="profile-card" style={ props.sx }>
			<div className="username">{ props.user.username }</div>
			<div className="team-number">#{ props.user.teamNumber }</div>
			{
				props.selectedEvent && (
					<Fragment>
						<div className="game-year">
							<CalendarMonthRounded id="year-icon" />
							<span>{ props.selectedEvent.gameYear }</span>
						</div>
						<div className="event-code">
							{ props.selectedEvent.eventCode }
						</div>
					</Fragment>
				)
			}
		</div>
	);

}
