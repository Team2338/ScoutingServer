import React from 'react';
import { Team, TeamObjectiveStats } from '../../../models';
import { roundToDecimal } from '../../../service/DisplayUtility';
import { useTranslator } from '../../../service/TranslateService';
import { GridScore } from '../../shared/GridScore';
import ViewImage from '../view-image/ViewImage';
import './TeamDetail.scss';
import InspectionSection from '../inspection-section/InspectionSection';
import { useAppSelector } from '../../../state';

interface IProps {
	team: Team;
}

export default function TeamDetail(props: IProps) {

	const translate = useTranslator();
	const userTeamNumber = useAppSelector(state => state.login.teamNumber);
	const isInspectionsEnabled = (userTeamNumber === 2338 || userTeamNumber === 9999); // TODO: move to service

	if (!props.team) {
		return <div>{ translate('SELECT_TEAM_VIEW_MORE_DETAILS') }</div>;
	}

	let gamemodeElements: any = [];
	if (props.team.stats) {
		props.team.stats.forEach((objectives: Map<string, TeamObjectiveStats>, gamemode: string) => {
			gamemodeElements.push(
				<Gamemode
					key={ gamemode }
					name={ gamemode }
					objectives={ objectives }
				/>
			);
		});
	} else {
		gamemodeElements = <div>{ translate('NO_QUANTITATIVE_DATA') }</div>;
	}

	return (
		<div className="team-detail">
			<div className="team-number">
				{ translate('TEAM') } { props.team.id }
				<ViewImage robotNumber={ props.team.id } />
			</div>
			{ isInspectionsEnabled && <InspectionSection robotNumber={ props.team.id } /> }
			<section className="gamemode-list">{ gamemodeElements }</section>
		</div>
	);
}

function Gamemode(props: { name: string, objectives: Map<string, TeamObjectiveStats> }) {

	const translate = useTranslator();

	const objectiveElements = [];
	props.objectives.forEach((stats: TeamObjectiveStats, name: string) => {
		objectiveElements.push(<ObjectiveStats key={ name } name={ name } stats={ stats }/>);
	});

	return (
		<div className="gamemode">
			<h2 className="gamemode-title">{ translate(props.name) }</h2>
			<div className="gamemode-stats-wrapper">
				{ objectiveElements }
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
				<div className="objective-stat">{ translate('SUM_LIST') }:</div>
				<div className="mean-list-wrapper">
					<GridScore list={ props.stats.sumList }/>
				</div>
			</React.Fragment>
		);
	}

	return (
		<div className="stats">
			<div className="objective-name">{ translate(props.name) }:</div>
			<div className="objective-stat">{ translate('SCORES') }: [ { scores.join(', ') } ]</div>
			<div className="objective-stat">{ translate('MEAN') }: { props.stats.mean.toFixed(2) }</div>
			<div className="objective-stat">{ translate('MEDIAN') }: { roundToDecimal(props.stats.median) }</div>
			<div className="objective-stat">{ translate('MODE') }: { roundToDecimal(props.stats.mode) }</div>
			{ sumListElement }
		</div>
	);

}
