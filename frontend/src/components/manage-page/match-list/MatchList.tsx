import './MatchList.scss'
import { Divider, List, ListItemButton } from '@mui/material';
import React from 'react';
import { Match } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';

type props = {
	matches: Match[];
	selectMatch: (match: Match) => void;
	selectedMatch: Match;
}

export default function MatchList ({ matches, selectMatch, selectedMatch }: props) {

	const translate = useTranslator();

	const listItems = matches.map((match: Match, index: number) => {
		const listItem = (
			<ListItemButton
				key={match.id}
				selected={match.id === selectedMatch?.id}
				onClick={() => selectMatch(match)}
			>
				<div className={'match-list-item' + (match.isHidden ? ' hidden' : '')}>
					<div className="match-number">{ translate('MATCH') } { match.matchNumber }</div>
					<div className="bottom-row">
						<div className="robot-number">{ translate('TEAM') } { match.robotNumber }</div>
						<div className="creator">{ match.creator }</div>
					</div>
				</div>
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
