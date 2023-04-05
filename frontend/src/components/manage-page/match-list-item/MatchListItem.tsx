import './MatchListItem.scss';
import { Icon } from '@mui/material';
import React from 'react';
import { Match } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	match: Match;
	isMobile: boolean;
}

export default function MatchListItem(props: IProps) {
	const translate = useTranslator();

	const chevron = (props.isMobile)
		? (
			<div className="chevron">
				<Icon color="primary">chevron_right</Icon>
			</div>
		)
		: null;

	return (
		<div className={
			'match-list-item'
			+ (props.isMobile ? ' match-list-item-mobile' : '')
			+ (props.match.isHidden ? ' hidden' : '')
		}>
			<div className="left-info">
				<div className="match-number">{ translate('MATCH') } { props.match.matchNumber }</div>
				<div className="robot-number">{ translate('TEAM') } { props.match.robotNumber }</div>
			</div>
			<div className="creator">{ props.match.creator }</div>
			{ chevron }
		</div>
	);
}
