import './MatchDetail.scss';
import React from 'react';
import { Match } from '../../../models/response.model';

interface IProps {
	match: Match;
}

export default function MatchDetail(props: IProps) {

	if (!props.match) {
		return <div>Select a match to view more details</div>
	}

	return (
		<div className="match-detail">
			<div className="match-number">Match { props.match.matchNumber }</div>
			<div className="team-number">Team { props.match.robotNumber }</div>
			<div className="creator">{ props.match.creator }</div>
			<div className="objectives">

			</div>
		</div>
	);
}
