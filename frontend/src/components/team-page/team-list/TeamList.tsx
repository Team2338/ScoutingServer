import React, { useState } from 'react';
import { Divider, List, ListItemButton, Typography } from '@mui/material';
import { Team } from '../../../models';
import './TeamList.scss';
import { useTranslator } from '../../../service/TranslateService';
import SearchInput from '../../shared/search-input/SearchInput';

interface IProps {
	teams: Team[];
	selectTeam: (team: Team) => void;
	selectedTeam: Team;
}

export default function TeamList({ teams, selectTeam, selectedTeam }: IProps) {

	const translate = useTranslator();
	const [searchTerm, setSearchTerm] = useState<string>('');

	const listItems = teams
		.filter((team: Team) => String(team.id).includes(searchTerm))
		.map((team: Team, index: number) => {
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
		<React.Fragment>
			<div className="team-list__header">
				<Typography
					variant="h6"
					sx={{
						marginBottom: '4px'
					}}
				>
					{ translate('TEAMS') }
				</Typography>
				<SearchInput onSearch={setSearchTerm} size="small" />
			</div>
			<Divider variant="fullWidth"/>
			<List>
				{ listItems }
			</List>
		</React.Fragment>
	);

}
