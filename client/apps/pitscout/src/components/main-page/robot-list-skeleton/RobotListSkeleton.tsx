import './RobotListSkeleton.scss';
import React from 'react';
import { Skeleton } from '@mui/material';


export default function RobotListSkeleton() {

	return (
		<div className="robot-list-skeleton">
			<Skeleton variant="rounded" width={48} height={20} />
			<Skeleton variant="rounded" width={48} height={20} />
			<Skeleton variant="rounded" width={48} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
			<Skeleton variant="rounded" width={40} height={20} />
		</div>
	);

}
