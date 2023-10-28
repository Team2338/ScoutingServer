import React, { useState } from 'react';
import { Divider, List, ListItemButton, Typography } from '@mui/material';
import { Statelet, Team } from '../../../models';
import './TeamList.scss';
import { useTranslator } from '../../../service/TranslateService';
import SearchInput from '../../shared/search-input/SearchInput';
import { selectSelectedTeam } from '../../../state/src/Selectors';
import { selectTeam, useAppDispatch } from '../../../state';

interface IProps {
	teams: Team[];
}

export default function TeamList({teams}: IProps) {

	const translate = useTranslator();
	const [searchTerm, setSearchTerm]: Statelet<string> = useState<string>('');
	const selectedTeam: Team = selectSelectedTeam();

	const dispatch = useAppDispatch();
	const _selectTeam = (team: Team) => dispatch(selectTeam(team.id));

	const listItems = teams
		.filter((team: Team) => String(team.id).includes(searchTerm))
		.map((team: Team, index: number) => {
			const listItem = (
				<ListItemButton
					key={ team.id }
					selected={ team.id === selectedTeam?.id }
					onClick={ () => _selectTeam(team) }
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
				<React.Fragment key={ team.id }>
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
				<SearchInput onSearch={ setSearchTerm } size="small"/>
			</div>
			<Divider variant="fullWidth"/>
			<List>
				{ listItems }
			</List>
		</React.Fragment>
	);

}
