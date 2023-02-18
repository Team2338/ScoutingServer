import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { Match } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';
import MatchListItem from '../match-list-item/MatchListItem';

function MatchSelector({ matches, selectedMatch, selectMatch }) {
	const translate = useTranslator();

	const handleMatchChange = (event) => {
		const matchId = event.target.value;
		const match = matches.find((match: Match) => match.id === matchId);
		selectMatch(match);
	};

	const options = matches.map((match: Match) => (
		<MenuItem key={match.id} value={match.id}>
			<MatchListItem match={match}/>
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
