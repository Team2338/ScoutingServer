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
import {
	Button,
	Icon,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import {
	ExternalLink,
	ExternalLinkType
} from '../../shared/external-link/ExternalLink';

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

	let matchNumbers: number[] = [];
	if (team?.stats) {
		const uniqueMatchNumbers = new Set(team?.stats.values().flatMap(
			(objectives) => objectives.values().flatMap(
				(stats) => stats.matchNumbers
			)
		));

		matchNumbers = Array.from(uniqueMatchNumbers).toSorted((a, b) => a - b);
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
						matchNumbers={ matchNumbers }
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
			<div className="external-links">
				<ExternalLink type={ ExternalLinkType.STATBOTICS } robotNumber={ props.robotNumber } />
				<ExternalLink type={ ExternalLinkType.TBA } robotNumber={ props.robotNumber } />
			</div>
			<InspectionSection
				robotNumber={ props.robotNumber }
				isDrawerOpen={ isInspectionDrawerOpen }
				closeDrawer={ () => setInspectionDrawerOpen(false) }
			/>
			<section className="gamemode-list">{ gamemodeElements }</section>
		</div>
	);
}

interface IGamemodeProps {
	name: string;
	matchNumbers: number[];
	objectives: Map<string, TeamObjectiveStats>;
}

function Gamemode(props: IGamemodeProps) {
	const translate = useTranslator();

	const gamemodeName = translate(props.name);
	const nStats = 3; // 25%, mean, 75%
	const nMatches = props.matchNumbers.length;

	return (
		<TableContainer className="gamemode">
			<Table size="small">
				<TableHead>
					<TableRow className="header-row">
						<TableCell>{ gamemodeName }</TableCell>
						<TableCell align="center" colSpan={ nStats }/>
						<TableCell align="center" colSpan={ nMatches }>
							{ translate('MATCHES') }
						</TableCell>
					</TableRow>
					<TableRow className="header-row">
						<TableCell></TableCell>
						<TableCell className="start-stats">25%</TableCell>
						<TableCell>{ translate('MEAN') }</TableCell>
						<TableCell className="end-stats">75%</TableCell>
						{ props.matchNumbers.map((match) => <TableCell aria-label={translate('MATCH') + "  " }>{ match }</TableCell>) }
					</TableRow>
				</TableHead>
				<GamemodeTableBody
					matchNumbers={ props.matchNumbers }
					objectives={ props.objectives }
				/>
			</Table>
		</TableContainer>
	);
}

interface IGamemodeTableBodyProps {
	matchNumbers: number[];
	objectives: Map<string, TeamObjectiveStats>;
}

function GamemodeTableBody(props: IGamemodeTableBodyProps) {
	const translate = useTranslator();

	return (
		<TableBody>
			{ props.objectives.keys().map((objectiveName) => (
				<GamemodeTableRow
					name={ translate(objectiveName) }
					objective={ props.objectives.get(objectiveName) }
					matchNumbers={ props.matchNumbers }
				/>
			))}
		</TableBody>
	);
}

interface IGamemodeTableRowProps {
	name: string,
	objective: TeamObjectiveStats,
	matchNumbers: number[]
}

function GamemodeTableRow({ name, objective, matchNumbers }: IGamemodeTableRowProps) {
	return (
		<TableRow>
			<TableCell variant="head">{ name }</TableCell>
			<TableCell variant="head" className="start-stats">
				{ objective.lowerQuartile.toFixed(1) }
			</TableCell>
			<TableCell variant="head">
				{ objective.mean.toFixed(1) }
			</TableCell>
			<TableCell variant="head" className="end-stats">
				{ objective.upperQuartile.toFixed(1) }
			</TableCell>
			{ matchNumbers.map((matchNumber) => (
				<ObjectiveStatCell
					objective={ objective }
					matchNumber={ matchNumber }
				/>
			))}
		</TableRow>
	);
}


interface IObjectiveStatCellProps {
	objective: TeamObjectiveStats,
	matchNumber: number
}

function ObjectiveStatCell(props: IObjectiveStatCellProps) {
	const index = props.objective.matchNumbers.indexOf(props.matchNumber);
	if (index == -1) {
		return (<TableCell></TableCell>);
	}

	const stat = props.objective.scores[index];
	console.log(stat);

	const formattedStat =
		stat == null ? "-" :
		Number.isInteger(stat) ? stat :
		stat.toFixed(1);

	return (
		<TableCell>
			{ formattedStat }
		</TableCell>
	)
}
