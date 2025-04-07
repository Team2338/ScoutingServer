import {
    Button,
    Icon,
	IconButton,
    Link,
} from '@mui/material';
import React, { ReactElement } from 'react';
import { Team } from 'apps/analytics/src/models';
import statboticsIcon from '/logos/32-statbotics-icon.png';
import tbaIcon from '/logos/32-tba-icon.png';
import './ExternalLink.scss';

function getTbaLinkForTeam(team: Team): string {
    return `https://thebluealliance.com/team/${team.id}`;
}

function getStatboticsLinkForTeam(team: Team): string {
    return `https://statbotics.io/team/${team.id}`;
}

export enum ExternalLinkType {
    STATBOTICS = 'statbotics',
    TBA = 'tba'
}

interface IExternalLink {
    type: ExternalLinkType,
    team: Team
}

export function ExternalLink({ type, team }: IExternalLink) {
    const linkProducer = type == ExternalLinkType.STATBOTICS
        ? getStatboticsLinkForTeam
        : getTbaLinkForTeam;

    const icon = type == ExternalLinkType.STATBOTICS
        ? statboticsIcon
        : tbaIcon;

    return (
        <Link href={ linkProducer(team) }
            target="_blank" 
            rel="noreferrer"
            underline="hover"
            className="link"
        >
            { team.id }
            <img src={ icon }/>
        </Link>
    )
}
