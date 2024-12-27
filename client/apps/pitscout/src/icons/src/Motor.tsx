import React from 'react';

interface IProps {
	className?: string;
}

export function MotorIcon({ className }: IProps) {
	return (
		<span className={ className } style={{ display: 'flex' }}>
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<line x1="4" y1="20" x2="16" y2="8" stroke="currentColor" strokeWidth="10" />
				<line x1="17" y1="7" x2="19" y2="5" stroke="currentColor" strokeWidth="10" />
				<line x1="19" y1="5" x2="23" y2="1" stroke="currentColor" strokeWidth="3" />
			</svg>
		</span>
	);
}
