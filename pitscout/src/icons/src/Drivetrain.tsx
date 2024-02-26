import React from 'react';

interface IProps {
	className?: string;
}

export function DrivetrainIcon({ className }: IProps) {
	return (
		<span className={ className } style={{ display: 'flex' }}>
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<line x1="3" y1="1" x2="3" y2="9" stroke="currentColor" strokeWidth="6" />
				<line x1="3" y1="15" x2="3" y2="23" stroke="currentColor" strokeWidth="6" />
				<line x1="21" y1="1" x2="21" y2="9" stroke="currentColor" strokeWidth="6" />
				<line x1="21" y1="15" x2="21" y2="23" stroke="currentColor" strokeWidth="6" />
				<line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth="4" />
				<line x1="6" y1="5" x2="18" y2="5" stroke="currentColor" strokeWidth="4" />
				<line x1="6" y1="19" x2="18" y2="19" stroke="currentColor" strokeWidth="4" />
			</svg>
		</span>
	);
}
