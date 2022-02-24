import './MatchDetail.scss';
import { Icon, IconButton } from '@material-ui/core';
import React from 'react';
import { Match, Objective } from '../../../models/response.model';
import { translate } from '../../../service/TranslateService';

interface IProps {
	match: Match;
	hide: (match: Match) => void;
	unhide: (match: Match) => void;
	translate: (key: string) => string;
}

export default translate(function MatchDetail(props: IProps) {

	if (!props.match) {
		return <div>{props.translate('SELECT_MATCH_VIEW_MORE_DETAILS')}</div>;
	}

	const gamemodeElements = []
	props.match.gamemodes.forEach((objectives: Objective[], gamemode: string) => {
		gamemodeElements.push(
			<Gamemode
				key={gamemode}
				name={gamemode}
				objectives={objectives}
			/>
		);
	});

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
})

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
