import './DownloadButton.scss';
import { Button, Icon, Tooltip } from '@mui/material';
import React from 'react';
import { EventInfo, LoadStatus } from '../../../models';
import { useTranslator } from '../../../service/TranslateService';
import { useAppSelector } from '../../../state';


export default function DownloadButton() {
	const translate = useTranslator();
	const selectedEvent: EventInfo = useAppSelector(state => state.loginV2.selectedEvent);
	const csv = useAppSelector(state => state.csv);

	if (!selectedEvent) {
		return null;
	}

	const filename: string = selectedEvent.teamNumber
		+ '_' + selectedEvent.gameYear
		+ '_' + selectedEvent.eventCode
		+ '.csv';

	return (
		<Tooltip title={ translate('DOWNLOAD_DATA_AS_CSV') }>
			<Button
				className="download-button"
				color="primary"
				disableElevation={ true }
				variant="contained"
				aria-label={ translate('DOWNLOAD_DATA') }
				startIcon={ <Icon>download</Icon> }
				href={ csv.url }
				download={ filename }
				disabled={ !(csv.loadStatus === LoadStatus.success) } // TODO: cover all the scenarios
			>
				{ translate('DATA') }
			</Button>
		</Tooltip>
	);
}
