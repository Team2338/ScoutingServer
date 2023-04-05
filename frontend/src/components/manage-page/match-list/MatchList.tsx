import './MatchList.scss'
import { Divider, List, ListItemButton } from '@mui/material';
import React from 'react';
import { Match } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import MatchListItem from '../match-list-item/MatchListItem';

type IProps = {
	matches: Match[];
	selectMatch: (match: Match) => void;
	selectedMatch: Match;
	searchTerm: string;
}

export default function MatchList({ matches, selectMatch, selectedMatch, searchTerm }: IProps) {
	const translate = useTranslator();

	const translatedTeamLabel: string = translate('TEAM').toLowerCase();
	const translatedMatchLabel: string = translate('MATCH').toLowerCase();

	const filteredMatches: Match[] = matches.filter((match: Match) => {
		const content: string = [
			translatedMatchLabel,
			match.matchNumber,
			translatedTeamLabel,
			match.robotNumber,
			match.creator.toLowerCase()
		].join(' ');

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
