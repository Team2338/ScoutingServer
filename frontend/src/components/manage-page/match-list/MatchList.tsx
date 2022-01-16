import './MatchList.scss'
import { Divider, List, ListItem } from '@material-ui/core';
import React from 'react';
import { Match } from '../../../models/response.model';

type props = {
	matches: Match[];
}

export default function MatchList ({ matches }: props) {

	const listItems = matches.map((match: Match, index: number) => {
		const listItem = (
			<ListItem key={match.id} button>
				<div className="match-list-item">
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
			<React.Fragment>
				<Divider variant="fullWidth" component="li" />
				{ listItem }
			</React.Fragment>
		);
	});

	return (
		<List>
			{listItems}
		</List>
	);

}
