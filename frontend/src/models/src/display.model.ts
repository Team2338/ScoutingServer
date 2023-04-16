import { ReactElement } from 'react';

export interface GridScoreConfig {
	[value: number]: {
		background: string;
		color?: string;
		innerContent?: ReactElement;
	};
}
