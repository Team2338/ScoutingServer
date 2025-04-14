import { Link } from '@mui/material';
import React from 'react';
import './ExternalLink.scss';

const STATBOTICS_ICON = '/logos/32-statbotics-icon.png';
const TBA_ICON = '/logos/32-tba-icon.png';

const getTbaLinkForTeam = (robotNumber: number): string => {
	return `https://thebluealliance.com/team/${ robotNumber }`;
};

const getStatboticsLinkForTeam = (robotNumber: number): string => {
	return `https://statbotics.io/team/${ robotNumber }`;
};

export enum ExternalLinkType {
	STATBOTICS = 'statbotics',
	TBA = 'tba'
}

interface IExternalLink {
	type: ExternalLinkType,
	robotNumber: number
}

export function ExternalLink({ type, robotNumber }: IExternalLink) {
	const linkProducer = type === ExternalLinkType.STATBOTICS
		? getStatboticsLinkForTeam
		: getTbaLinkForTeam;

	const icon = type === ExternalLinkType.STATBOTICS
		? STATBOTICS_ICON
		: TBA_ICON;

	const altText = type === ExternalLinkType.STATBOTICS
		? 'Statbotics'
		: 'The Blue Alliance';

	return (
		<Link
			href={ linkProducer(robotNumber) }
			target="_blank"
			rel="noreferrer"
			underline="hover"
			className="external-link"
		>
			{ robotNumber }
			<img src={ icon } alt={ altText } />
		</Link>
	);
}
