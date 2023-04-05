import './MatchListItem.scss';
import React from 'react';
import { Match } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	match: Match;
	isMobile: boolean;
}

export default function MatchListItem(props: IProps) {
	const translate = useTranslator();

	return (
		<div className={
			'match-list-item'
			+ (props.isMobile ? ' match-list-item-mobile' : '')
			+ (props.match.isHidden ? ' hidden' : '')
		}>
			<div className="match-number">{ translate('MATCH') } { props.match.matchNumber }</div>
			<div className="bottom-row">
				<div className="robot-number">{ translate('TEAM') } { props.match.robotNumber }</div>
				<div className="creator">{ props.match.creator }</div>
			</div>
		</div>
	);
}
