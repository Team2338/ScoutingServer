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
