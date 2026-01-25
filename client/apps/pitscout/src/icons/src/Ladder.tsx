import React from 'react';

interface IProps {
	className?: string;
}

export function LadderIcon({ className }: IProps) {
	return (
		<span className={ className } style={{ display: 'flex' }}>
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<line x1="2" y1="0" x2="2" y2="24" stroke="currentColor" stroke-width="3" />
				<line x1="22" y1="0" x2="22" y2="24" stroke="currentColor" stroke-width="3" />
				<line x1="3.5" y1="3" x2="20.5" y2="3" stroke="currentColor" stroke-width="2" />
				<line x1="3.5" y1="10" x2="20.5" y2="10" stroke="currentColor" stroke-width="2" />
				<line x1="3.5" y1="17" x2="20.5" y2="17" stroke="currentColor" stroke-width="2" />
			</svg>
		</span>
	);
}
