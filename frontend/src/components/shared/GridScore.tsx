import React from 'react';
import './GridScore.scss';

interface IProps {
	list: number[];
}

export function GridScore(props: IProps) {

	const listElements = props.list.map((score: number, index: number) => (
			<div key={index} className="grid-display-score">{ score }</div>
	));

	return (
		<div className="grid-display">{ listElements }</div>
	);
}
