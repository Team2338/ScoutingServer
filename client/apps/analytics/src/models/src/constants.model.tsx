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
	'#884099',
	'#44ac88'
];

export const GAMEMODE_ORDERING: Record<string, string> = {
	'AUTO': '0',
	'TELEOP': '1',
	'SUPERSCOUT': '99'
};

export const OBJECTIVE_ORDERING: Record<string, number> = {
	'RED_TRENCH_2026': 0,
	'RED_BUMP_2026': 1,
	'BLUE_TRENCH_2026': 2,
	'BLUE_BUMP_2026': 3,
	'CLIMB_2026': 3.5,
	'5_CYCLE_2026': 4,
	'10_CYCLE_2026': 5,
	'20_CYCLE_2026': 6,
	'30_CYCLE_2026': 7,
	'40_CYCLE_2026': 8,
	'50_CYCLE_2026': 9,
	'HIGH_GOAL_2026': 10,
	'ACCURACY': 11,
	'HIGH_GOAL_SUCCESS_2026': 12
};
