import './EventManagementPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { useAppSelector } from '../../state';
import { IEventInfo, LoadStatus } from '@gearscout/models';
import DataFailure from '../shared/data-failure/DataFailure';
import {
	IconButton,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import { useCallback } from 'react';
import { MoreVert } from '@mui/icons-material';

const StyledRow = styled(TableRow)(({ theme }) => ({
	['&.selected']: {
		backgroundColor: theme.palette.grey['100'],
		fontWeight: 'bold',
	}
}));

export default function EventManagementPage() {
	const translate = useTranslator();

	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.list);
	const selectedEvent: IEventInfo = useAppSelector(state => state.events.selectedEvent);

	const isRowSelected = useCallback(
		(event: IEventInfo) => event.eventId === selectedEvent.eventId,
		[selectedEvent]
	);

	if (eventLoadStatus === LoadStatus.none || eventLoadStatus === LoadStatus.loading) {
		return <main className="page event-management-page">{ translate('LOADING') }</main>;
	}

	if (eventLoadStatus === LoadStatus.failed) {
		return (
			<main className="page event-management-page event-management-page-failed">
				<DataFailure messageKey="FAILED_TO_LOAD_EVENTS" />
			</main>
		);
	}

	return (
		<main className="page event-management-page">
			<h2 className="page-title">{ translate('EVENTS') }</h2>
			<TableContainer>
				<Table aria-label={ translate('EVENTS_TABLE') }>
					<TableHead>
						<TableRow>
							<TableCell>
								{ translate('EVENT_CODE') }
							</TableCell>
							<TableCell>
								{ translate('SECRET_CODE') }
							</TableCell>
							<TableCell align="center">
								{ translate('GAME_YEAR') }
							</TableCell>
							<TableCell align="right">
								{ translate('ACTIONS') }
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							events.map(event => (
								<StyledRow key={ event.eventId } className={ isRowSelected(event) ? 'selected': '' }>
									<TableCell>{ event.eventCode }</TableCell>
									<TableCell>{ event.secretCode }</TableCell>
									<TableCell align="center">{ event.gameYear }</TableCell>
									<TableCell align="right">
										<IconButton className="action-button" size="small">
											<MoreVert/>
										</IconButton>
									</TableCell>
								</StyledRow>
							))
						}
					</TableBody>
				</Table>
			</TableContainer>
		</main>
	);
}
