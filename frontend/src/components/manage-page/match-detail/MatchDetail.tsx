import './MatchDetail.scss';
import { Icon, IconButton } from '@material-ui/core';
import React from 'react';
import { Match, Objective } from '../../../models/response.model';

interface IProps {
	match: Match;
	hide: (match: Match) => void;
	unhide: (match: Match) => void;
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

	// Map to Gamemode components
	const gamemodeElements = keys.map((key: string) => (
		<Gamemode
			key={key}
			name={key}
			objectives={gamemodes.get(key)}
		/>
	));

	const handleHiddenClick = () => {
		if (props.match.isHidden) {
			props.unhide(props.match);
			return;
		}

		props.hide(props.match);
	}

	const hiddenLabel = props.match.isHidden ? <span className="hidden">Hidden</span> : null

	return (
		<div className={'match-detail' + (props.match.isHidden ? ' hidden' : '')}>
			<div className="info">
				<div className="match-number">
					Match { props.match.matchNumber }
					{ hiddenLabel  }
				</div>
				<div className="team-number">Team { props.match.robotNumber }</div>
				<div className="creator">{ props.match.creator }</div>
				<div className="objectives">
					{ gamemodeElements }
				</div>
			</div>
			<div className="action-area">
				<IconButton size="small" onClick={handleHiddenClick}>
					<Icon fontSize="small" color="inherit">delete</Icon>
				</IconButton>
			</div>
		</div>
	);
}

function Gamemode(props: { name: string, objectives: Objective[] }) {

	const objectiveElements = props.objectives.map((objective: Objective) => (
		<div key={objective.id}>{ objective.objective }: { objective.count }</div>
	));

	return (
		<div className="gamemode">
			<div className="gamemode-title">{ props.name }</div>
			{ objectiveElements }
		</div>
	);
}
