import React, { ReactElement } from 'react';
import './GridScore.scss';

type GridVariant = 'binary' | 'heatmap';
type Size = 'normal' | 'large';
interface IProps {
	list: number[];
	variant?: GridVariant;
	size?: Size;
}

export function GridScore(props: IProps) {

	const variant: GridVariant = props.variant ?? 'heatmap';
	const size: Size = props.size ?? 'normal';

	let listElements: ReactElement[];
	if (variant === 'binary') {
		listElements = getBinaryElements(props.list);
	} else {
		listElements = getHeatmapElements(props.list);
	}

	return (
		<div className={'grid-display ' + size}>{ listElements }</div>
	);
}

function getBinaryElements(list: number[]) {
	return list.map((score: number, index: number) => (
		<div
			key={index}
			className="grid-display-score"
			style={{
				backgroundColor: score > 0 ? 'green' : '#aaa'
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
		const ratio = (max > 0) ? (score / max) : 0;
		const percent = (score > 0) ? Math.round(score * 100) + '%' : '';
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
				{ percent }
			</div>
		);
	});
}
