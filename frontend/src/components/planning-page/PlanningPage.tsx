import './PlanningPage.scss';
import React, { useState } from 'react';
import { Team } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { useAppDispatch, useAppSelector, useDataInitializer } from '../../state/Hooks';
import { TeamSelector } from '../shared/team-selector/TeamSelector';


function PlanningPage() {
	useDataInitializer();
	const translate = useTranslator();

	const dispatch = useAppDispatch();
	const isLoaded: boolean = useAppSelector(state => state.teams.isLoaded);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const [firstTeam, setFirstTeam] = useState<Team>(null);
	const [secondTeam, setSecondTeam] = useState<Team>(null);
	const [thirdTeam, setThirdTeam] = useState<Team>(null);

	if (!isLoaded) {
		return <div className="planning-page">{ translate('LOADING') }</div>;
	}

	return (
		<div className="page planning-page">
			<div className="team-selectors">
				<TeamSelector teams={teams} selectedTeam={firstTeam} selectTeam={setFirstTeam}/>
				<TeamSelector teams={teams} selectedTeam={secondTeam} selectTeam={setSecondTeam}/>
				<TeamSelector teams={teams} selectedTeam={thirdTeam} selectTeam={setThirdTeam}/>
				<div>Here's the planning page!</div>
			</div>
		</div>
	)
}

export default PlanningPage;
