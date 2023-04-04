import './MatchList.scss'
import { Divider, List, ListItemButton } from '@mui/material';
import React from 'react';
import { Match } from '../../../models';
import MatchListItem from '../match-list-item/MatchListItem';

type IProps = {
	matches: Match[];
	selectMatch: (match: Match) => void;
	selectedMatch: Match;
	searchTerm: string;
}

export default function MatchList({ matches, selectMatch, selectedMatch, searchTerm }: IProps) {
	const filteredMatches: Match[] = matches.filter((match: Match) => {
		const content = `match ${match.matchNumber} team ${match.robotNumber} ${match.creator.toLowerCase()}`;
		console.log(`${content} | ${searchTerm.toLowerCase()}`)
		return content.includes(searchTerm.toLowerCase());
	});

	const listItems = filteredMatches.map((match: Match, index: number) => {
		const listItem = (
			<ListItemButton
				key={match.id}
				selected={match.id === selectedMatch?.id}
				onClick={() => selectMatch(match)}
			>
				<MatchListItem match={match}/>
			</ListItemButton>
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
