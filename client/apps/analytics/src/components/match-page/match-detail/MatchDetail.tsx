import { Icon, IconButton, Tooltip, useTheme } from '@mui/material';
import React from 'react';
import { getLowContrastTextColor, Match, Objective, superchargeGridScoreConfig } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { GridScore } from '../../shared/GridScore';
import './MatchDetail.scss';

interface IProps {
	match: Match;
	hide: (match: Match) => void;
	unhide: (match: Match) => void;
	isMobile: boolean;
	sx?: object;
}

export default function MatchDetail(props: IProps) {

	const translate = useTranslator();
	const theme = useTheme();
	const lightTextColor = getLowContrastTextColor(theme, theme.palette.background.default);

	if (!props.match) {
		return <div>{ translate('SELECT_MATCH_VIEW_MORE_DETAILS') }</div>;
	}

	const gamemodeElements = [];
	props.match.gamemodes.forEach((objectives: Objective[], gamemode: string) => {
		gamemodeElements.push(
			<Gamemode
				key={ gamemode }
				name={ gamemode }
				objectives={ objectives }
			/>
		);
	});

	const handleHiddenClick = () => {
		if (props.match.isHidden) {
			props.unhide(props.match);
			return;
		}

		props.hide(props.match);
	};

	const hiddenLabel = props.match.isHidden ? <span className="hidden">{ translate('HIDDEN') }</span> : null;

	return (
		<div
			className={
				'match-detail'
				+ (props.match.isHidden ? ' hidden' : '')
				+ (props.isMobile ? ' match-detail-mobile' : '')
			}
			style={ props.sx }
		>
			<div className="info">
				<div className="match-number">
					{ translate('MATCH') } { props.match.matchNumber }
					{ hiddenLabel }
				</div>
				<div className="team-number">{ translate('TEAM') } { props.match.robotNumber }</div>
				<div className="creator" style={{ color: lightTextColor }}>
					{ props.match.creator }
				</div>
				<div className="objectives">
					{ gamemodeElements }
				</div>
			</div>
			<div className="action-area">
				<Tooltip title={ translate(props.match.isHidden ? 'INCLUDE_IN_STATS' : 'EXCLUDE_FROM_STATS') }>
					<IconButton size="small" onClick={ handleHiddenClick }>
						<Icon fontSize="small" color="inherit">delete</Icon>
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
}

function Gamemode(props: { name: string, objectives: Objective[] }) {
	const translate = useTranslator();
	const theme = useTheme();
	const lightTextColor = getLowContrastTextColor(theme, theme.palette.background.default);

	const getObjectiveElement = (objective: Objective) => {
		if (objective.list !== null && objective.list !== undefined) {
			return <ListObjective key={ objective.objective } objective={ objective } />;
		}

		return <SimpleObjective key={ objective.objective } objective={ objective } />;
	};

	const objectiveElements = props.objectives.map(getObjectiveElement);

	return (
		<div className="gamemode">
			<div className="gamemode-title" style={{ color: lightTextColor }}>
				{ translate(props.name) }
			</div>
			{ objectiveElements }
		</div>
	);
}

function SimpleObjective(props: { objective: Objective }) {
	const translate = useTranslator();
	return <div>{ translate(props.objective.objective) }: { props.objective.count }</div>;
}

function ListObjective(props: { objective: Objective }) {
	const translate = useTranslator();

	return (
		<div className="objective-list">
			<div className="objective-list-title">{ translate(props.objective.objective) }:</div>
			<GridScore
				variant="custom"
				config={ superchargeGridScoreConfig }
				list={ props.objective.list }
			/>
		</div>
	);
}
