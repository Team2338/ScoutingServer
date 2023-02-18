import './MatchList.scss'
import { Divider, List, ListItemButton } from '@mui/material';
import React from 'react';
import { Match } from '../../../models/response.model';
import MatchListItem from '../match-list-item/MatchListItem';

type IProps = {
	matches: Match[];
	selectMatch: (match: Match) => void;
	selectedMatch: Match;
}

export default function MatchList({ matches, selectMatch, selectedMatch }: IProps) {
	const listItems = matches.map((match: Match, index: number) => {
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
