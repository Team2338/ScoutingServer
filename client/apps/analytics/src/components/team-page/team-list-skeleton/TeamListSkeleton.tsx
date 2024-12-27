import React, { Fragment } from 'react';
import './TeamListSkeleton.scss';
import { Divider, Skeleton } from '@mui/material';

interface IProps {
	isMobile: boolean;
}

export default function TeamListSkeleton(props: IProps) {
	const variant: string = props.isMobile
		? 'team-list-skeleton-mobile'
		: 'team-list-skeleton';

	const elements = Array.from(new Array(40)).map((_, index: number) => (
		<Fragment key={ index }>
			<div className="team-list-skeleton-item">
				<Skeleton variant="text" width="4em" sx={{ fontSize: '1em' }} />
			</div>
			<Divider variant="fullWidth" />
		</Fragment>
	));

	return (
		<div className={ variant }>
			{ elements }
		</div>
	);
}
