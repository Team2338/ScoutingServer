import React, { ReactElement } from 'react';
import './GridScore.scss';
import { superchargeGridScoreConfig } from '../../models';
import { GridScoreConfig } from '../../models/src/display.model';
import { roundToDecimal } from '../../service/DisplayUtility';

type GridVariant = 'binary' | 'heatmap' | 'custom';
type Size = 'normal' | 'large';
interface IProps {
	list: number[];
	variant?: GridVariant;
	size?: Size;
	config?: GridScoreConfig;
}

export function GridScore(props: IProps) {

	const variant: GridVariant = props.variant ?? 'heatmap';
	const size: Size = props.size ?? 'normal';
	const config: GridScoreConfig = props.config ?? superchargeGridScoreConfig;

	let listElements: ReactElement[];
	if (variant === 'binary') {
		listElements = getBinaryElements(props.list);
	} else if (variant === 'custom') {
		listElements = getCustomElements(props.list, config);
	} else {
		listElements = getHeatmapElements(props.list);
	}

	return (
		<div className={'grid-display ' + size}>{ listElements }</div>
	);
}

const getBinaryColor = (score: number): string => {
	return score > 0 ? '#43A047' : 'rgba(0, 0, 0, 0.24)';
};

function getBinaryElements(list: number[]) {
	return list.map((score: number, index: number) => (
		<div
			key={index}
			className="grid-display-score"
			style={{
				backgroundColor: getBinaryColor(score)
			}}
		></div>
	));
}

const heatmapLookup = {
	0: '#444',
	1: '#ef5350',
	2: '#ff7043',
	3: '#ffa726',
	4: '#ffca28',
	5: '#ffee58',
	6: '#d4e157',
	7: '#9ccc65',
	8: '#66bb6a',
	9: '#26a69a',
	10: '#26c6da',
};

function getHeatmapElements(list: number[]) {
	const max: number = Math.max(...list); // TODO: Can memoize this
	return list.map((score: number, index: number) => {
		const roundedScore = (score > 0) ? roundToDecimal(score) : '';
		const ratio = (max > 0) ? (score / max) : 0;
		const echelon = Math.floor(ratio * 10);
		const backgroundColor = heatmapLookup[echelon];
		return (
			<div
				key={index}
				className="grid-display-score heatmap"
				style={{
					backgroundColor: backgroundColor
				}}
			>
				{ roundedScore }
			</div>
		);
	});
}

function getCustomElements(list: number[], config: GridScoreConfig) {
	return list.map((score: number, index: number) => (
		<div
			key={index}
			className="grid-display-score custom"
			style={{
				backgroundColor: config[score]?.color ?? getBinaryColor(score)
			}}
		>
			{ config[score]?.innerContent }
		</div>
	));
}
