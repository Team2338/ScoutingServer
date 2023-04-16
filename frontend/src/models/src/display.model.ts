import { ReactElement } from 'react';

export interface GridScoreConfig {
	[value: number]: {
		color: string;
		innerContent: ReactElement;
	};
}
