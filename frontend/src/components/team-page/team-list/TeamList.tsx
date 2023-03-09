import React from 'react';
import { Divider, List, ListItemButton } from '@mui/material';
import { Team } from '../../../models';

interface IProps {
	teams: Team[];
	selectTeam: (team: Team) => void;
	selectedTeam: Team
}

export default function TeamList({ teams, selectTeam, selectedTeam }: IProps) {

	const listItems = teams.map((team: Team, index: number) => {
		const listItem = (
			<ListItemButton
				key={team.id}
				selected={team.id === selectedTeam?.id}
				onClick={() => selectTeam(team)}
				sx={{
					paddingTop: '12px',
					paddingBottom: '12px'
				}}
			>
				<div className="team-list-item">
					<div>{ team.id }</div>
				</div>
			</ListItemButton>
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
