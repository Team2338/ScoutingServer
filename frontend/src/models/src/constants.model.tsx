import BoltIcon from '@mui/icons-material/Bolt';
import React from 'react';
import { GridScoreConfig } from './display.model';

export const superchargeGridScoreConfig: GridScoreConfig = {
	0: {
		color: 'grey',
		innerContent: null
	},
	1: {
		color: 'green',
		innerContent: null
	},
	2: {
		color: 'blue',
		innerContent: <BoltIcon />
	}
};
