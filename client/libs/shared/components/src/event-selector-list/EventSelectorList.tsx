import React, {
	Fragment,
	useMemo
} from 'react';
import {
	IEventInfo,
	LoadStatus
} from '@gearscout/models';
import styles from './EventSelectorList.module.scss';
import {
	Button,
	Skeleton
} from '@mui/material';

interface IProps {
	events: IEventInfo[];
	eventLoadStatus: LoadStatus;
	handleEventSelected: (event: IEventInfo) => void;
	handleRetry: () => void;
}

interface IGroupedEvents {
	groupedEvents: Record<number, IEventInfo[]>;
	years: number[];
}

export function EventSelectorList(props: IProps) {
	switch (props.eventLoadStatus) {
		case LoadStatus.loadingWithPriorSuccess: // Fallthrough
		case LoadStatus.failedWithPriorSuccess: // Fallthrough
		case LoadStatus.success:
			return <ActualList { ...props } />;
		case LoadStatus.failed:
			return <FailedList { ...props } />;
		default:
			return <SkeletonList />;
	}
}

const SkeletonList = () => (
	<ol className={ styles.eventList }>
		{ new Array(8).fill(0).map((_, index: number) => (
			<li key={ index } className={ styles.eventListItem }>
				<Skeleton
					variant="rounded"
					width={ '100%' }
					height={ 56 }
				/>
			</li>
		)) }
	</ol>
);

const ActualList = (props: IProps) => {
	const { groupedEvents, years } = useMemo(
		() => groupEventsByYear(props.events),
		[props.events]
	);

	return years.map(year => (
		<Fragment key={ year }>
			<h3 className={ styles.year }>{ year }</h3>
			<ol className={ styles.eventList }>
				{
					groupedEvents[year].map((event: IEventInfo, index: number) => (
						<li key={ index } className={ styles.eventListItem }>
							<button onClick={ () => props.handleEventSelected(event) }>
								<span className={ styles.eventCodeLabel }>{ event.eventCode }</span>
								<span className={ styles.inspectionCount }>{ event.inspectionCount ?? 0 } Inspections</span>
								<span className={ styles.secretCodeLabel }>{ event.secretCode }</span>
								<span className={ styles.matchCount }>{ event.matchCount ?? 0 } Matches</span>
							</button>
						</li>
					))
				}
			</ol>
		</Fragment>
	));
};

const FailedList = (props: IProps) => (
	<Fragment>
		<div>Failed to load events</div>
		<Button onClick={ props.handleRetry }>Retry</Button>
	</Fragment>
);

const groupEventsByYear = (events: IEventInfo[]): IGroupedEvents => {
	const sortedEvents: IEventInfo[] = events.toSorted((a, b) => b.gameYear - a.gameYear);
	const groupedEvents: Record<number, IEventInfo[]> = {};
	const years: number[] = [];
	for (const event of sortedEvents) {
		if (!Object.hasOwn(groupedEvents, event.gameYear)) {
			groupedEvents[event.gameYear] = [];
			years.push(event.gameYear);
		}

		groupedEvents[event.gameYear].push(event);
	}

	return {
		groupedEvents,
		years
	};
};
