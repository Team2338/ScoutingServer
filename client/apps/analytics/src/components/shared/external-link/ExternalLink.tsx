import {
    Button,
    Icon,
	IconButton,
    Link,
} from '@mui/material';
import React, { ReactElement } from 'react';
import statboticsIcon from '/logos/32-statbotics-icon.png';
import tbaIcon from '/logos/32-tba-icon.png';
import './ExternalLink.scss';

function getTbaLinkForTeam(robotNumber: number): string {
    return `https://thebluealliance.com/team/${robotNumber}`;
}

function getStatboticsLinkForTeam(robotNumber: number): string {
    return `https://statbotics.io/team/${robotNumber}`;
}

export enum ExternalLinkType {
    STATBOTICS = 'statbotics',
    TBA = 'tba'
}

interface IExternalLink {
    type: ExternalLinkType,
    robotNumber: number
}

export function ExternalLink({ type, robotNumber }: IExternalLink) {
    const linkProducer = type == ExternalLinkType.STATBOTICS
        ? getStatboticsLinkForTeam
        : getTbaLinkForTeam;

    const icon = type == ExternalLinkType.STATBOTICS
        ? statboticsIcon
        : tbaIcon;

    return (
        <Link href={ linkProducer(robotNumber) }
            target="_blank" 
            rel="noreferrer"
            underline="hover"
            className="link"
        >
            { robotNumber }
            <img src={ icon }/>
        </Link>
    )
}
