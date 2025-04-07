import React, {
	Fragment,
	useState
} from 'react';
import {
	GAMEMODE_ORDERING,
	Statelet,
	Team,
	TeamObjectiveStats
} from '../../../models';
import { roundToDecimal } from '../../../service/DisplayUtility';
import { useTranslator } from '../../../service/TranslateService';
import { GridScore } from '../../shared/GridScore';
import './TeamDetail.scss';
import InspectionSection from '../inspection-section/InspectionSection';
import { useAppSelector } from '../../../state';
import { Button, Icon } from '@mui/material';
import { ExternalLink, ExternalLinkType } from '../../shared/external-link/ExternalLink';

interface IProps {
	robotNumber: number;
}

export default function TeamDetail(props: IProps) {

	const translate = useTranslator();
	const team: Team = useAppSelector(state => state.teams.data.find((team: Team) => team.id === props.robotNumber));
	const [isInspectionDrawerOpen, setInspectionDrawerOpen]: Statelet<boolean> = useState(false);

	if (!props.robotNumber) {
		return <div>{ translate('SELECT_TEAM_VIEW_MORE_DETAILS') }</div>;
	}

	let gamemodeElements: any = [];
	if (team?.stats) {
		gamemodeElements = Array.from(team.stats.keys())
			// .toArray() // Not yet implemented in Safari...
			.toSorted((a: string, b: string) => (GAMEMODE_ORDERING[a] ?? a).localeCompare((GAMEMODE_ORDERING[b] ?? b)))
			.map((gamemode: string) => {
				const objectives = team.stats.get(gamemode);
				return (
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
				<span>{ translate('TEAM') } { props.robotNumber }</span>
				<Button
					color="primary"
					startIcon={ <Icon>assignment_turned_in</Icon> }
					onClick={ () => setInspectionDrawerOpen(true) }
				>
					{ translate('INSPECTION') }&nbsp;&gt;
				</Button>
			</div>
			<InspectionSection
				robotNumber={ props.robotNumber }
				isDrawerOpen={ isInspectionDrawerOpen }
				closeDrawer={ () => setInspectionDrawerOpen(false) }
			/>
			<div className="external-links">
				<ExternalLink type={ExternalLinkType.STATBOTICS} robotNumber={props.robotNumber}/>
				<ExternalLink type={ExternalLinkType.TBA} robotNumber={props.robotNumber}/>
			</div>
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
			<h3 className="gamemode-title">{ translate(props.name) }</h3>
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
			<Fragment>
				<div className="objective-stat">{ translate('SUM_LIST') }:</div>
				<div className="mean-list-wrapper">
					<GridScore list={ props.stats.sumList }/>
				</div>
			</Fragment>
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
