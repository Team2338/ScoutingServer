import React from 'react';
import { Divider, Skeleton } from '@mui/material';
import './MatchListSkeleton.scss';

export default function MatchListSkeleton() {

	const loaders = [];
	loaders.push(<MatchListSkeletonItem key={0} />);
	for (let i = 1; i < 16; i++) {
		loaders.push(
			<React.Fragment key={i}>
				<Divider/>
				<MatchListSkeletonItem/>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			{ loaders }
		</React.Fragment>
	);
}

function MatchListSkeletonItem() {
	return (
		<div className="match-list-skeleton-item">
			<div className="left">
				<Skeleton
					animation="wave"
					width="80px"
					height="30px"
				/>
				<Skeleton
					animation="wave"
					width="60px"
					height="22px"
				/>
			</div>
			<div className="right">
				<Skeleton
					animation="wave"
					width="100px"
					height="22px"
				/>
			</div>
		</div>
	);
}
