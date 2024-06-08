import './EventSelector.scss';
import React from 'react';
import { EventInfo, LoadStatus } from '../../../models';

interface IProps {
	events: EventInfo[];
	selectEvent: (event: EventInfo) => void;
}

export default function EventSelector(props: IProps) {
	const eventListItems = props.events.map((event: EventInfo) => (
		<li
			key={ event.gameYear + '\0' + event.eventCode + '\0' + event.secretCode }
			className="event-selector-option"
			onClick={ () => props.selectEvent(event) }
		>
			<div>{ event.eventCode } <span>({ event.matchCount })</span></div>
			<div>********</div>
		</li>
	));

	return (
		<ol className="event-selector">
			{ eventListItems }
		</ol>
	);
}
