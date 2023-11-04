import { useAppSelector } from '../Hooks';
import { Team } from '../../models';

export const selectSelectedTeam = (): Team => useAppSelector(state =>
	state.teams.data.find((team: Team) => team.id === state.teams.selectedTeam)
);
