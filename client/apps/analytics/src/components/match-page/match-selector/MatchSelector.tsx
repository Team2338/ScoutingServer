import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { Match } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import MatchListItem from '../match-list-item/MatchListItem';

interface IProps {
	matches: Match[];
	selectedMatch: Match;
	selectMatch: (match: Match) => void;
}

function MatchSelector({ matches, selectedMatch, selectMatch }: IProps) {
	const translate = useTranslator();

	const handleMatchChange = (event) => {
		const matchId = event.target.value;
		const match: Match = matches.find((match: Match) => match.id === matchId);
		selectMatch(match);
	};

	const options = matches.map((match: Match) => (
		<MenuItem key={match.id} value={match.id}>
			<MatchListItem match={match} isMobile={false}/>
		</MenuItem>
	));

	return (
		<TextField
			className="match-selector"
			variant="outlined"
			label={translate('MATCHES')}
			value={selectedMatch?.id ?? ''}
			onChange={handleMatchChange}
			select
		>
			{ options }
		</TextField>
	);
}

export default MatchSelector;
