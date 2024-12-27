import './EventSelectorList.scss';
import React from 'react';
import { IEventInfo } from '@gearscout/models';

interface IProps {
	events: IEventInfo[];
	selectEvent: (event: IEventInfo) => void;
}

export default function EventSelectorList(props: IProps) {
	const eventListItems = props.events.map((event: IEventInfo) => (
		<li
			key={ event.gameYear + '\0' + event.eventCode + '\0' + event.secretCode }
			className="event-selector-list-option"
			onClick={ () => props.selectEvent(event) }
		>
			<div>{ event.eventCode } <span>({ event.matchCount ?? 0 })</span></div>
			<div>********</div>
		</li>
	));

	return (
		<ol className="event-selector-list">
			{ eventListItems }
		</ol>
	);
}
