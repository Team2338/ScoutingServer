import './MatchList.scss'
import { Divider, List, ListItem } from '@material-ui/core';
import React from 'react';
import { Match } from '../../../models/response.model';

type props = {
	matches: Match[];
	selectMatch: (match: Match) => void;
	selectedMatch: Match;
}

export default function MatchList ({ matches, selectMatch, selectedMatch }: props) {

	const listItems = matches.map((match: Match, index: number) => {
		const listItem = (
			<ListItem
				button
				key={match.id}
				selected={match.id === selectedMatch?.id}
				onClick={() => selectMatch(match)}
			>
				<div className={'match-list-item' + (match.isHidden ? ' hidden' : '')}>
					<div className="match-number">Match { match.matchNumber }</div>
					<div className="bottom-row">
						<div className="robot-number">Team { match.robotNumber }</div>
						<div className="creator">{ match.creator }</div>
					</div>
				</div>
			</ListItem>
		);

		if (index === 0) {
			return listItem;
		}

		return (
			<React.Fragment key={match.id}>
				<Divider variant="fullWidth" component="li" />
				{ listItem }
			</React.Fragment>
		);
	});

	return (
		<List>
			{ listItems }
		</List>
	);

}
