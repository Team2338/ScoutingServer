import './EventSelectorList.scss';
import React from 'react';
import { EventInfo } from '../../../models';

interface IProps {
	events: EventInfo[];
	selectEvent: (event: EventInfo) => void;
}

export default function EventSelectorList(props: IProps) {
	const eventListItems = props.events.map((event: EventInfo) => (
		<li
			key={ event.gameYear + '\0' + event.eventCode + '\0' + event.secretCode }
			className="event-selector-list-option"
			onClick={ () => props.selectEvent(event) }
		>
			<div>{ event.eventCode } <span>({ event.matchCount })</span></div>
			<div>********</div>
		</li>
	));

	return (
		<ol className="event-selector-list">
			{ eventListItems }
		</ol>
	);
}
