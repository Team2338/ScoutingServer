import './TeamSelector.scss';
import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';
import { Team } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';

export function TeamSelector({ teams, selectedTeam, selectTeam }) {
	const translate = useTranslator();

	const handleTeamChange = (event) => {
		const teamNum = event.target.value;
		let team: Team = teams.find((team: Team) => team.id === teamNum);

		if (team === null) {
			// Then this is a team with notes and not data
			team = {
				id: teamNum,
				stats: null
			};
		}

		selectTeam(team);
	}

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
