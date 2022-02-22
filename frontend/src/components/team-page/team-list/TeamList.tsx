import React from 'react';
import { Divider, List, ListItem } from '@material-ui/core';
import { Team } from '../../../models/response.model';

interface IProps {
	teams: Team[];
	selectTeam: (team: Team) => void;
	selectedTeam: Team
}

export default function TeamList({ teams, selectTeam, selectedTeam }: IProps) {

	const listItems = teams.map((team: Team, index: number) => {
		const listItem = (
			<ListItem
				button
				key={team.id}
				selected={team.id === selectedTeam?.id}
				onClick={() => selectTeam(team)}
			>
				<div className="team-list-item">
					<div>{ team.id }</div>
				</div>
			</ListItem>
		);

		if (index === 0) {
			return listItem;
		}

		return (
			<React.Fragment key={team.id}>
				<Divider variant="fullWidth" component="li"/>
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
