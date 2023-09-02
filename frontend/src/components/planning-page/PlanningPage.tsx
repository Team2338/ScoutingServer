import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { LoadStatus, Plan, Team, TeamObjectiveStats } from '../../models';
import { roundToDecimal } from '../../service/DisplayUtility';
import { useTranslator } from '../../service/TranslateService';
import {
	applyPlanSelection,
	clearPlan,
	selectFirstTeamForPlanning,
	selectSecondTeamForPlanning,
	selectThirdTeamForPlanning,
	useAppDispatch,
	useAppSelector,
	useDataInitializer
} from '../../state';
import { GridScore } from '../shared/GridScore';
import { TeamSelector } from '../shared/team-selector/TeamSelector';
import './PlanningPage.scss';


function PlanningPage() {
	useDataInitializer();
	const translate = useTranslator();

	const dispatch = useAppDispatch();
	const teamsLoadStatus: LoadStatus = useAppSelector(state => state.teams.loadStatus);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const plan: Plan = useAppSelector(state => state.planning.plan);
	const firstTeam: Team = useAppSelector(state => state.planning.firstTeam);
	const secondTeam: Team = useAppSelector(state => state.planning.secondTeam);
	const thirdTeam: Team = useAppSelector(state => state.planning.thirdTeam);

	if (teamsLoadStatus === LoadStatus.none || teamsLoadStatus === LoadStatus.loading) {
		return <div className="planning-page">{ translate('LOADING') }</div>;
	}

	if (teamsLoadStatus === LoadStatus.failed) {
		return <div className="planning-page">{ translate('FAILED_TO_LOAD_TEAMS') }</div>;
	}

	const numberOfTeamsSelected: number = [firstTeam, secondTeam, thirdTeam]
		.map<number>((team: Team) => team === null ? 0 : 1)
		.reduce((sum: number, value: number) => sum + value);
	const isApplyDisabled: boolean = numberOfTeamsSelected < 2;

	return (
		<main className="page planning-page">
			<Typography variant="h6">{ translate('PLAN') }</Typography>
			<div className="team-selectors">
				<TeamSelector
					teams={ teams }
					selectedTeam={ firstTeam }
					selectTeam={ (team) => dispatch(selectFirstTeamForPlanning(team)) }
				/>
				<TeamSelector
					teams={ teams }
					selectedTeam={ secondTeam }
					selectTeam={ (team) => dispatch(selectSecondTeamForPlanning(team)) }
				/>
				<TeamSelector
					teams={ teams }
					selectedTeam={ thirdTeam }
					selectTeam={ (team) => dispatch(selectThirdTeamForPlanning(team)) }
				/>
				<div className="action-area">
					<Button
						onClick={ () => dispatch(clearPlan()) }
						variant="outlined"
						color="primary"
					>
						{ translate('CLEAR') }
					</Button>
					<Button
						onClick={ () => dispatch(applyPlanSelection(firstTeam, secondTeam, thirdTeam)) }
						variant="contained"
						color="primary"
						disabled={ isApplyDisabled }
					>
						{ translate('APPLY') }
					</Button>
				</div>
			</div>
			<div className="plan">
				{ plan ? <PlanDisplay plan={ plan } /> : null }
			</div>
		</main>
	);
}

export default PlanningPage;


interface IPlanDisplay {
	plan: Plan;
}

function PlanDisplay({ plan }: IPlanDisplay) {
	const translate = useTranslator();
	const gamemodeNames: string[] = Object.getOwnPropertyNames(plan.gamemodes);
	const gamemodeElements: ReactElement[] = [];

	for (const gamemodeName of gamemodeNames) {
		const objectiveNames: string[] = Object.getOwnPropertyNames(plan.gamemodes[gamemodeName].objectives);
		const objectiveElements: ReactElement[] = objectiveNames.map((objectiveName: string) => (
			<div key={ objectiveName } className="objective">
				<div className="objective-header">{ translate(objectiveName) }</div>
				<div>
					<PlanComparison
						teams={ plan.teams }
						stats={ plan.gamemodes[gamemodeName].objectives[objectiveName].stats }
					/>
				</div>
			</div>
		));

		gamemodeElements.push((
			<div key={ gamemodeName } className="gamemode">
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
	console.log(stats);

	const grids = [];
	for (let i: number = 0; i < teams.length; i++) {
		if (stats[i] && stats[i].sumList) {
			grids.push(
				<div key={ teams[i].id } className="comparison-grid">
					<div className="team-number">{ teams[i].id }</div>
					<GridScore list={ stats[i].sumList } variant="heatmap" />
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
							{
								teams.map((team: Team) => (
									<TableCell key={team.id}>{ team.id }</TableCell>
								))
							}
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left">{ translate('MEAN') }</TableCell>
							{
								stats.map((teamStat: TeamObjectiveStats) => (
									<TableCell key={teamStat.teamNumber}>{ teamStat ? teamStat.mean.toFixed(2) : '-' }</TableCell>
								))
							}
						</TableRow>
						<TableRow>
							<TableCell align="left">{ translate('MEDIAN') }</TableCell>
							{
								stats.map((teamStat: TeamObjectiveStats) => (
									<TableCell key={teamStat.teamNumber}>{ teamStat ? roundToDecimal(teamStat.median) : '-' }</TableCell>
								))
							}
						</TableRow>
						<TableRow>
							<TableCell align="left">{ translate('MAX') }</TableCell>
							{
								stats.map((teamStat: TeamObjectiveStats) => (
									<TableCell key={teamStat.teamNumber}>{ teamStat ? roundToDecimal(Math.max(...teamStat.scores)) : '-' }</TableCell>
								))
							}
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			{ grids.length === 0 ? null : <div className="comparison-grids">{ grids }</div> }
		</div>
	);
}
