import './TeamSelector.scss';
import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { Team } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';

export function TeamSelector({ teams, selectedTeam, selectTeam }) {
	const translate = useTranslator();

	const handleTeamChange = (event) => {
		const teamNum = event.target.value;
		let team: Team = teams.find((team: Team) => team.id === teamNum);

		selectTeam(team);
	};

	const options = teams.map((team: Team) => (
		<MenuItem key={team.id} value={team.id}>{ team.id }</MenuItem>
	));

	return (
		<TextField
			className="team-selector"
			variant="outlined"
			label={translate('TEAM_NUMBER')}
			value={selectedTeam?.id ?? ''}
			onChange={handleTeamChange}
			select
		>
			{ options }
		</TextField>
	);
}
