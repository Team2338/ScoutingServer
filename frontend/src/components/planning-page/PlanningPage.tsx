import './PlanningPage.scss';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppState, Team } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { getMatches, getTeams } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import { AppDispatch } from '../../state/Store';
import { TeamSelector } from '../shared/team-selector/TeamSelector';

interface IProps {
	areMatchesLoaded: boolean;
	areTeamsLoaded: boolean;
	getMatches: () => void;
	getTeamStats: () => void;
}

const inputs = (state: AppState) => ({
	areMatchesLoaded: state.matches.isLoaded,
	areTeamsLoaded: state.teams.isLoaded
});

const outputs = (dispatch: AppDispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams())
});

class ConnectedPlanningPage extends React.Component<IProps, {}> {

	componentDidMount() {
		if (!this.props.areMatchesLoaded) {
			this.props.getMatches();
			return;
		}

		if (!this.props.areTeamsLoaded) {
			this.props.getTeamStats();
		}
	}

	render() {
		return <PlanningPageContent/>;
	}
}

function PlanningPageContent() {
	const dispatch = useAppDispatch();
	const translate = useTranslator();
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

const PlanningPage = connect(inputs, outputs)(ConnectedPlanningPage);
export default PlanningPage;
