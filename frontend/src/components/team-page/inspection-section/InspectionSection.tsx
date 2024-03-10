import './InspectionSection.scss';
import React, { useMemo } from 'react';
import { ImageState, LoadStatus } from '../../../models';
import { useAppSelector } from '../../../state';
import { Skeleton } from '@mui/material';

interface IProps {
	robotNumber: number;
}

export default function InspectionSection(props: IProps) {
	const imageInfo: ImageState = useAppSelector(state => state.images);
	const inspectionStatus: LoadStatus = useAppSelector(state => state.inspections.loadStatus);

	const image = useMemo(() => {
		if (imageInfo.loadStatus === LoadStatus.none) {
			return null;
		}

		if (imageInfo.loadStatus === LoadStatus.loading) {
			return <Skeleton variant="rectangular" width={ 160 } height={ 160 } />;
		}

		if (imageInfo.loadStatus === LoadStatus.failed) {
			// TODO: return special element on failure
			return null;
		}

		const url: string = imageInfo.images[props.robotNumber]?.url;
		if (url) {
			return (
				<div className="inspection-section__robot-image-wrapper">
					<img
						className="inspection-section__robot-image"
						alt=""
						role="presentation"
						src={ url }
					/>
					<a
						className="inspection-section__robot-image-link"
						target="_blank"
						rel="noreferrer"
						href={ url}>Original size
					</a>
				</div>
			);
		}

		// TODO: return special element when no image exists for this robot
		return null;
	}, [imageInfo.images, imageInfo.loadStatus, props.robotNumber]);

	const inspection = useMemo(() => {
		if (inspectionStatus === LoadStatus.none) {
			return null;
		}

		if (inspectionStatus === LoadStatus.loading) {
			return <Skeleton width="4em" />;
		}

		if (inspectionStatus === LoadStatus.failed) {
			return null;
		}



	}, [inspectionStatus]);

	return (
		<section className="inspection-section">
			<h2>Inspection</h2>
			<div className="inspection-section__content">
				{ image }
			</div>
		</section>
	);
}
