import './PlanningPage.scss';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { AppState, Plan, Team, TeamObjectiveStats } from '../../models';
import { roundToDecimal } from '../../service/DisplayUtility';
import { useTranslator } from '../../service/TranslateService';
import { applyPlanSelection, clearPlan, selectFirstTeamForPlanning, selectSecondTeamForPlanning, selectThirdTeamForPlanning } from '../../state/Actions';
import { getMatches, getTeams } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import { AppDispatch } from '../../state/Store';
import { TeamSelector } from '../shared/team-selector/TeamSelector';
import { GridScore } from '../shared/GridScore';

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
	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const isLoaded: boolean = useAppSelector(state => state.teams.isLoaded);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const plan: Plan = useAppSelector(state => state.planning.plan);
	const firstTeam: Team = useAppSelector(state => state.planning.firstTeam);
	const secondTeam: Team = useAppSelector(state => state.planning.secondTeam);
	const thirdTeam: Team = useAppSelector(state => state.planning.thirdTeam);

	if (!isLoaded) {
		return <div className="planning-page">{ translate('LOADING') }</div>;
	}

	const isApplyDisabled: boolean = (firstTeam === null) || (secondTeam === null) || (thirdTeam === null);

	return (
		<div className="page planning-page">
			<div className="team-selectors">
				<TeamSelector
					teams={teams}
					selectedTeam={firstTeam}
					selectTeam={(team) => dispatch(selectFirstTeamForPlanning(team))}
				/>
				<TeamSelector
					teams={teams}
					selectedTeam={secondTeam}
					selectTeam={(team) => dispatch(selectSecondTeamForPlanning(team))}
				/>
				<TeamSelector
					teams={teams}
					selectedTeam={thirdTeam}
					selectTeam={(team) => dispatch(selectThirdTeamForPlanning(team))}
				/>
				<div className="action-area">
					<Button
						onClick={() => dispatch(clearPlan())}
						variant="outlined"
						color="primary"
					>
						{ translate('CLEAR') }
					</Button>
					<Button
						onClick={() => dispatch(applyPlanSelection(firstTeam, secondTeam, thirdTeam))}
						variant="contained"
						color="primary"
						disabled={isApplyDisabled}
					>
						{ translate('APPLY') }
					</Button>
				</div>
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
	const gamemodeNames: string[] = Object.getOwnPropertyNames(plan.gamemodes);
	const gamemodeElements: ReactElement[] = [];

	for (const gamemodeName of gamemodeNames) {
		const objectiveNames: string[] = Object.getOwnPropertyNames(plan.gamemodes[gamemodeName].objectives);
		const objectiveElements: ReactElement[] = objectiveNames.map((objectiveName: string) => (
			<div key={objectiveName} className="objective">
				<div className="objective-header">{ translate(objectiveName) }</div>
				<div>
					<PlanComparison
						teams={plan.teams}
						stats={plan.gamemodes[gamemodeName].objectives[objectiveName].stats}
					/>
				</div>
			</div>
		));

		gamemodeElements.push((
			<div key={gamemodeName} className="gamemode">
				<div className="gamemode-header">{ translate(gamemodeName) }</div>
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

interface IPlanComparisonProps {
	teams: Team[];
	stats: TeamObjectiveStats[];
}

function PlanComparison({ teams, stats }: IPlanComparisonProps) {
	const translate = useTranslator();

	const grids = [];
	for (let i = 0; i < teams.length; i++) {
		if (stats[i] && stats[i].sumList) {
			grids.push(
				<div key={teams[i].id} className="comparison-grid">
					<div className="team-number">{ teams[i].id }</div>
					<GridScore list={stats[i].sumList} variant="heatmap" />
				</div>
			);
		}
	}

	return (
		<div className="comparison">
			<TableContainer>
				<Table aria-label={ translate('STATS_TABLE') }>
					<TableHead>
						<TableRow>
							<TableCell>{ translate('STATS') }</TableCell>
							<TableCell>{ teams[0].id }</TableCell>
							<TableCell>{ teams[1].id }</TableCell>
							<TableCell>{ teams[2].id }</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left">{ translate('MEAN') }</TableCell>
							<TableCell>{ stats[0] ? stats[0].mean.toFixed(2) : '-' }</TableCell>
							<TableCell>{ stats[1] ? stats[1].mean.toFixed(2) : '-' }</TableCell>
							<TableCell>{ stats[2] ? stats[2].mean.toFixed(2) : '-' }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">{ translate('MEDIAN') }</TableCell>
							<TableCell>{ stats[0] ? roundToDecimal(stats[0].median) : '-' }</TableCell>
							<TableCell>{ stats[1] ? roundToDecimal(stats[1].median) : '-' }</TableCell>
							<TableCell>{ stats[2] ? roundToDecimal(stats[2].median) : '-' }</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left">{ translate('MAX') }</TableCell>
							<TableCell>{ stats[0] ? roundToDecimal(Math.max(...stats[0].scores)) : '-' }</TableCell>
							<TableCell>{ stats[1] ? roundToDecimal(Math.max(...stats[1].scores)) : '-' }</TableCell>
							<TableCell>{ stats[2] ? roundToDecimal(Math.max(...stats[2].scores)) : '-' }</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			{ grids.length === 0 ? null : <div className="comparison-grids">{ grids }</div> }
		</div>
	);
}
