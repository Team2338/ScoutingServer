import './MatchDetail.scss';
import { Icon, IconButton } from '@material-ui/core';
import React from 'react';
import { Match, Objective } from '../../../models/response.model';

interface IProps {
	match: Match;
}

export default function MatchDetail(props: IProps) {

	if (!props.match) {
		return <div>Select a match to view more details</div>
	}

	// Group objectives by gamemode
	const gamemodes = new Map<string, Objective[]>();
	const keys: string[] = [];
	for (const objective of props.match.objectives) {
		if (!gamemodes.has(objective.gamemode)) {
			gamemodes.set(objective.gamemode, []);
			keys.push(objective.gamemode);
		}

		gamemodes.get(objective.gamemode).push(objective);
	}

	// Sort gamemodes alphabetically
	keys.sort();

	// Map to HTML elements
	const gamemodeElements = [];
	for (const key of keys) {
		const objectives = gamemodes.get(key).map((objective: Objective) => (
			<div key={objective.id}>{ objective.objective }: { objective.count }</div>
		));

		gamemodeElements.push(
			<div key={key} className="gamemode">
				<div className="gamemode-title">{ key }</div>
				{ objectives }
			</div>
		);
	}

	return (
		<div className="match-detail">
			<div className="info">
				<div className="match-number">Match { props.match.matchNumber }</div>
				<div className="team-number">Team { props.match.robotNumber }</div>
				<div className="creator">{ props.match.creator }</div>
				<div className="objectives">
					{ gamemodeElements }
				</div>
			</div>
			<div className="action-area">
				<IconButton size="small">
					<Icon fontSize="small" color="inherit">delete</Icon>
				</IconButton>
			</div>
		</div>
	);
}
