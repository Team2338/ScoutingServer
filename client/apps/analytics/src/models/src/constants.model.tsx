import BoltIcon from '@mui/icons-material/Bolt';
import React from 'react';
import { GridScoreConfig } from './display.model';
import { alpha, Theme } from '@mui/material/styles';

export const superchargeGridScoreConfig: GridScoreConfig = {
	0: {
		background: 'rgba(0, 0, 0, 0.24)',
	},
	1: {
		background: '#43A047',
	},
	2: {
		// background: 'rgb(40, 170, 255)',
		background: '#28aaff',
		color: '#ffffff80',
		innerContent: <BoltIcon />
	}
};

export const STAT_GRAPH_COLORS: string[] = [
	'#254999',
	'#dd8850',
	'#884099',
	'#44ac88'
];

export const GAMEMODE_ORDERING: Record<string, string> = {
	'AUTO': '0',
	'TELEOP': '1',
	'SUPERSCOUT': '99'
};

export const getLowContrastTextColor = (theme: Theme, backgroundColor: string) => {
	const contrastText = theme.palette.getContrastText(backgroundColor);
	return alpha(contrastText, 0.65);
}
