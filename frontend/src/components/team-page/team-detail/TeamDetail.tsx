import React, { useEffect } from 'react';
import { Note, Team, TeamObjectiveStats } from '../../../models';
import { roundToDecimal } from '../../../service/DisplayUtility';
import { useTranslator } from '../../../service/TranslateService';
import { getImageForRobot, useAppDispatch } from '../../../state';
import { GridScore } from '../../shared/GridScore';
import ViewNotes from '../view-notes/ViewNotes';
import './TeamDetail.scss';

interface IProps {
	team: Team;
	notes: Note[];
}

export default function TeamDetail(props: IProps) {

	const translate = useTranslator();
	const dispatch = useAppDispatch();

	useEffect(
		() => {
			if (!!props.team) {
				dispatch(getImageForRobot(props.team.id));
			}
		},
		[dispatch, props.team]
	);

	if (!props.team) {
		return <div>{translate('SELECT_TEAM_VIEW_MORE_DETAILS')}</div>;
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
		gamemodeElements = <div>{translate('NO_QUANTITATIVE_DATA')}</div>;
	}

	return (
		<div className="team-detail">
			<div className="team-number">
				{translate('TEAM')} {props.team.id}
				<ViewNotes robotNumber={props.team.id} notes={props.notes}/>
			</div>
			<div className="gamemode-list">{gamemodeElements}</div>
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
			<div className="gamemode-title">{translate(props.name)}</div>
			<div className="gamemode-stats-wrapper">
				{objectiveElements}
			</div>
		</div>
	);
}

function ObjectiveStats(props: { name: string, stats: TeamObjectiveStats }) {

	const translate = useTranslator();
	const scores = props.stats.scores.map(roundToDecimal);

	let sumListElement = null;
	if (props.stats.sumList) {
		sumListElement = (
			<React.Fragment>
				<div className="objective-stat">{translate('SUM_LIST')}:</div>
				<div className="mean-list-wrapper">
					<GridScore list={props.stats.sumList}/>
				</div>
			</React.Fragment>
		);
	}

	return (
		<div className="stats">
			<div className="objective-name">{translate(props.name)}:</div>
			<div className="objective-stat">{translate('SCORES')}: [ {scores.join(', ')} ]</div>
			<div className="objective-stat">{translate('MEAN')}: {props.stats.mean.toFixed(2)}</div>
			<div className="objective-stat">{translate('MEDIAN')}: {roundToDecimal(props.stats.median)}</div>
			<div className="objective-stat">{translate('MODE')}: {roundToDecimal(props.stats.mode)}</div>
			{sumListElement}
		</div>
	);

}
