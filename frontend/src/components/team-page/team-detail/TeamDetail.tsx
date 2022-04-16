import './TeamDetail.scss';
import React from 'react';
import { Note, Team, TeamObjectiveStats } from '../../../models/response.model';
import { useTranslator } from '../../../service/TranslateService';
import ViewNotes from '../view-notes/ViewNotes';

interface IProps {
	team: Team;
	notes: Note[]
}

export default function TeamDetail(props: IProps) {

	const translate = useTranslator();

	if (!props.team) {
		return <div>{ translate('SELECT_TEAM_VIEW_MORE_DETAILS') }</div>;
	}

	let gamemodeElements: any = [];
	if (props.team.stats) {
		props.team.stats.forEach((objectives: Map<string, TeamObjectiveStats>, gamemode: string) => {
			gamemodeElements.push(
				<Gamemode
					key={gamemode}
					name={gamemode}
					objectives={objectives}
				/>
			);
		});
	} else {
		gamemodeElements = <div>No quantitative data for this team</div>
	}

	return (
		<div className="team-detail">
			<div className="team-number">
				{ translate('TEAM') } { props.team.id }
				<ViewNotes isMobile={false} notes={props.notes}/>
			</div>
			<div className="gamemode-list">{ gamemodeElements }</div>
		</div>
	);
}

function Gamemode(props: { name: string, objectives: Map<string, TeamObjectiveStats> }) {

	const translate = useTranslator();

	const objectiveElements = [];
	props.objectives.forEach((stats: TeamObjectiveStats, name: string) => {
		objectiveElements.push(<ObjectiveStats key={name} name={name} stats={stats}/>);
	});

	return (
		<div className="gamemode">
			<div className="gamemode-title">{ translate(props.name) }</div>
			<div className="gamemode-stats-wrapper">
				{ objectiveElements }
			</div>
		</div>
	)
}

function ObjectiveStats(props: { name: string, stats: TeamObjectiveStats }) {

	const translate = useTranslator();
	const scores = props.stats.scores.map((score: number) => +score.toFixed(2));

	return (
		<div className="stats">
			<div className="objective-name">{ translate(props.name) }:</div>
			<div className="objective-stat">{ translate('SCORES') }: [ { scores.join(', ') } ]</div>
			<div className="objective-stat">{ translate('MEAN') }: { props.stats.mean.toFixed(2) }</div>
			<div className="objective-stat">{ translate('MEDIAN') }: { +props.stats.median.toFixed(2) }</div>
			<div className="objective-stat">{ translate('MODE') }: { +props.stats.mode.toFixed(2) }</div>
		</div>
	);

}
