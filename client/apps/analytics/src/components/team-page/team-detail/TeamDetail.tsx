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

	const sortedObjectiveNames = Array.from(props.objectives.keys());

	return (
		<TableContainer sx={{ borderRadius: '8px' }}>
			<Table size="small">
				<TableHead>
					<TableRow sx={{ backgroundColor: '#eee' }}>
						<TableCell>{translate(props.name)}</TableCell>
						<TableCell align="center" colSpan={3}></TableCell>
						<TableCell align="center" colSpan={props.matchNumbers.length}>{ translate('MATCHES') }</TableCell>
					</TableRow>
					<TableRow sx={{ backgroundColor: '#eee' }}>
						<TableCell></TableCell>
						<TableCell>25%</TableCell>
						<TableCell>{ translate('MEAN') }</TableCell>
						<TableCell>75%</TableCell>
						{ props.matchNumbers.map((match) => <TableCell>{ match }</TableCell>) }
					</TableRow>
				</TableHead>
				<TableBody>
					{ sortedObjectiveNames.map((objectiveName) => {
						const objective = props.objectives.get(objectiveName);
						return (
							<TableRow>
								<TableCell variant="head">{ translate(objectiveName) }</TableCell>
								<TableCell variant="head">
									{ objective.lowerQuartile.toFixed(1) }
								</TableCell>
								<TableCell variant="head">
									{ objective.mean.toFixed(1) }
								</TableCell>
								<TableCell variant="head">
									{ objective.upperQuartile.toFixed(1) }
								</TableCell>
								{ props.matchNumbers.map((matchNumber) => (
									<ObjectiveStatCell
										objective={ objective }
										matchNumber={ matchNumber }
									/>
								))}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
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
