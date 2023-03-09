import './PlanningPage.scss';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { AppState, Plan, Team, TeamObjectiveStats } from '../../models';
import { roundToDecimal } from '../../service/DisplayUtility';
import { useTranslator } from '../../service/TranslateService';
import { applyPlanSelection } from '../../state/Actions';
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
	const plan: Plan = useAppSelector(state => state.planning.plan);
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
				<Button
					onClick={() => dispatch(applyPlanSelection(firstTeam, secondTeam, thirdTeam))}
					variant="contained"
				>
					{ translate('TODO_APPLY') }
				</Button>
			</div>
			<div className="plan">
				{ plan ? <PlanDisplay plan={plan}/> : null }
			</div>
		</div>
	);
}

const PlanningPage = connect(inputs, outputs)(ConnectedPlanningPage);
export default PlanningPage;


interface IPlanDisplay {
	plan: Plan
}

function PlanDisplay({ plan }: IPlanDisplay) {
	const translate = useTranslator();
	const gamemodeNames: string[] = Object.getOwnPropertyNames(plan);
	const gamemodeElements: ReactElement[] = [];

	for (const gamemode of gamemodeNames) {
		const objectiveNames: string[] = Object.getOwnPropertyNames(plan[gamemode]);
		const objectiveElements: ReactElement[] = objectiveNames.map((objective: string) => (
			<div key={objective} className="objective">
				<div className="objective-header">{ translate(objective) }</div>
				<div>
					<PlanComparison stats={plan[gamemode][objective]}/>
				</div>
			</div>
		));

		gamemodeElements.push((
			<div key={gamemode} className="gamemode">
				<div className="gamemode-header">{ translate(gamemode) }</div>
				<div className="gamemode-objectives">{ objectiveElements }</div>
			</div>
		));
	}

	return (
		<div className="gamemodes">
			{ gamemodeElements }
		</div>
	);
}

function PlanComparison({ stats }: { stats: TeamObjectiveStats[] }) {
	const translate = useTranslator();

	return (
		<TableContainer>
			<Table aria-label={ translate('STATS_TABLE') }>
				<TableHead>
					<TableRow>
						<TableCell>{ translate('STATS') }</TableCell>
						<TableCell>{ stats[0].teamNumber }</TableCell>
						<TableCell>{ stats[1].teamNumber }</TableCell>
						<TableCell>{ stats[2].teamNumber }</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell align="left">{ translate('MEAN') }</TableCell>
						<TableCell>{ stats[0].mean.toFixed(2) }</TableCell>
						<TableCell>{ stats[1].mean.toFixed(2) }</TableCell>
						<TableCell>{ stats[2].mean.toFixed(2) }</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="left">{ translate('MEDIAN') }</TableCell>
						<TableCell>{ roundToDecimal(stats[0].median) }</TableCell>
						<TableCell>{ roundToDecimal(stats[1].median) }</TableCell>
						<TableCell>{ roundToDecimal(stats[2].median) }</TableCell>
					</TableRow>
					<TableRow>
						<TableCell align="left">{ translate('TODO_MAX') }</TableCell>
						<TableCell>{ roundToDecimal(Math.max(...stats[0].scores)) }</TableCell>
						<TableCell>{ roundToDecimal(Math.max(...stats[1].scores)) }</TableCell>
						<TableCell>{ roundToDecimal(Math.max(...stats[2].scores)) }</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
