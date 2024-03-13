import './InspectionSection.scss';
import React, { useMemo } from 'react';
import { ImageState, Inspection, InspectionQuestion, InspectionState, LoadStatus } from '../../../models';
import { useAppSelector } from '../../../state';
import { CircularProgress, Drawer, Skeleton } from '@mui/material';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	robotNumber: number;
	isDrawerOpen: boolean;
	closeDrawer: () => void;
}

export default function InspectionSection(props: IProps) {
	const translate = useTranslator();
	const imageInfo: ImageState = useAppSelector(state => state.images);
	const inspectionState: InspectionState = useAppSelector(state => state.inspections);

	const imageElement = useMemo(() => {
		if (imageInfo.loadStatus === LoadStatus.none) {
			return null;
		}

		if (imageInfo.loadStatus === LoadStatus.loading) {
			return <Skeleton variant="rectangular" width={ 240 } height={ 240 } />;
		}

		if (imageInfo.loadStatus === LoadStatus.failed) {
			// TODO: return special element on failure
			return null;
		}

		const url: string = imageInfo.images[props.robotNumber]?.url;
		if (url) {
			return (
				<div className="inspection-section__robot-image-wrapper">
					<a
						className="inspection-section__robot-image-link"
						target="_blank"
						rel="noreferrer"
						href={ url }
					>
						<img
							className="inspection-section__robot-image"
							alt=""
							role="presentation"
							src={ url }
						/>
					</a>
				</div>
			);
		}

		// TODO: return special element when no image exists for this robot
		return null;
	}, [imageInfo.loadStatus, imageInfo.images, props.robotNumber]);

	const inspectionElement = useMemo(() => {
		const inspectionStatus = inspectionState.loadStatus;

		if (inspectionStatus === LoadStatus.none) {
			return null;
		}

		if (inspectionStatus === LoadStatus.loading) {
			return <CircularProgress style={{ marginLeft: 'auto', marginRight: 'auto', padding: '24px' }} />;
		}

		if (inspectionStatus === LoadStatus.failed) {
			return <div>Failed to load inspections!</div>;
		}

		const inspection: Inspection = inspectionState.inspections
			.find((insp: Inspection) => insp.robotNumber === props.robotNumber);

		// TODO: return special element when no inspection exists for this robot
		if (inspection) {
			return inspection.questions.map((question: InspectionQuestion) => (
				<div key={ question.id } className="inspection-section__question">
					<h3 className="inspection-section__question-title">{ translate(question.question) }</h3>
					<div className="inspection-section__question-answer">{ question.answer }</div>
				</div>
			));
		}

	}, [inspectionState.loadStatus, inspectionState.inspections, props.robotNumber, translate]);

	return (
		<section className="inspection-section">
			{/*<h2>Inspection</h2>*/ }
			<div className="inspection-section__content">
				{ imageElement }
				{/*{ inspectionElement }*/ }
			</div>
			<Drawer
				id="team-inspection-drawer"
				anchor="right"
				open={ props.isDrawerOpen }
				onClose={ props.closeDrawer }
			>
				<div id="team-inspection-drawer__content">
					<h2 id="team-inspection-drawer__header">Inspection</h2>
					<div id="team-inspection-drawer__body">
						{ inspectionElement }
					</div>
				</div>
			</Drawer>
		</section>
	);
}
