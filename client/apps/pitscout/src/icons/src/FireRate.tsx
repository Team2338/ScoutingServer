import React from 'react';

interface IProps {
	className?: string;
}

export function FireRateIcon({ className }: IProps) {
	return (
		<span className={ className } style={{ display: 'flex' }}>
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<circle r="4" cx="20" cy="4" fill="#777"/>
				<circle r="5" cx="16" cy="6" fill="white"/>
				<circle r="4" cx="16" cy="6" fill="#999"/>
				<path
					d="M11 7 Q-10 24 11 41"
					fill="transparent"
					strokeWidth="1"
					stroke="grey"
				/>
				<path
					d="M12 9 Q-7 24 12 39"
					fill="transparent"
					strokeWidth="1"
					stroke="grey"
				/>
				<path
					d="M13 11 Q-4 24 13 37"
					fill="transparent"
					strokeWidth="1"
					stroke="grey"
				/>
				<circle r="5" cx="12" cy="9" fill="white"/>
				<circle r="4" cx="12" cy="9" fill="#BBB"/>
			</svg>
		</span>
	);
}
