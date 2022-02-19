import './TeamDetail.scss';
import React from 'react';
import { Team, TeamObjectiveStats } from '../../../models/response.model';

interface IProps {
	team: Team;
}

export default function TeamDetail(props: IProps) {

	if (!props.team) {
		return <div>Select a team to view more details</div>;
	}

	const gamemodeElements = []
	props.team.stats.forEach((objectives: Map<string, TeamObjectiveStats>, gamemode: string) => {
		gamemodeElements.push(
			<Gamemode
				key={gamemode}
				name={gamemode}
				objectives={objectives}
			/>
		);
	});

	return (
		<div className="team-detail">
			<div className="team-number">Team { props.team.id }</div>
			<div className="gamemode-list">{ gamemodeElements }</div>
		</div>
	);
}

function Gamemode(props: { name: string, objectives: Map<string, TeamObjectiveStats> }) {

	const objectiveElements = [];
	props.objectives.forEach((stats: TeamObjectiveStats, name: string) => {
		objectiveElements.push(<ObjectiveStats key={name} name={name} stats={stats}/>);
	});

	return (
		<div className="gamemode">
			<div className="gamemode-title">{ props.name }</div>
			<div className="gamemode-stats-wrapper">
				{ objectiveElements }
			</div>
		</div>
	)
}

function ObjectiveStats(props: { name: string, stats: TeamObjectiveStats }) {

	return (
		<div className="stats">
			<div className="objective-name">{ props.name }:</div>
			<div className="objective-stat">Scores: [ { props.stats.scores.join(', ') } ]</div>
			<div className="objective-stat">Mean: { props.stats.mean }</div>
			<div className="objective-stat">Median: { props.stats.median }</div>
			<div className="objective-stat">Mode: { props.stats.mode }</div>
		</div>
	);

}
