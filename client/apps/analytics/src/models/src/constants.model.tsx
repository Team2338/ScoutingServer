import BoltIcon from '@mui/icons-material/Bolt';
import React from 'react';
import { GridScoreConfig } from './display.model';

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
	'#704099',
	'#44ab52'
];

export const STAT_GRAPH_COLOR_SCALE_1: string[] = [
    '#ffe532',
    '#d2da9a',
    '#bbcbac',
    '#a6bbb4',
    '#93abb7',
    '#829bb8',
    '#718cb6',
    '#607db3',
    '#4f6daf',
    '#3d5faa',
    '#2750a4',
	'#00429d',
]

export const STAT_GRAPH_COLOR_SCALE_UNKNOWN: string = '#aaaaaa';

export const GAMEMODE_ORDERING: Record<string, string> = {
	'AUTO': '0',
	'TELEOP': '1',
	'SUPERSCOUT': '99'
};
