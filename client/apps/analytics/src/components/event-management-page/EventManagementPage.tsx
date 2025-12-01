import { useTranslator } from '../../service/TranslateService';
import { useAppSelector } from '../../state';
import { IEventInfo, LoadStatus } from '@gearscout/models';
import DataFailure from '../shared/data-failure/DataFailure';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


export default function EventManagementPage() {
	const translate = useTranslator();

	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.list);
	const selectedEvent: IEventInfo = useAppSelector(state => state.events.selectedEvent);

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
							<TableCell>
								{ translate('GAME_YEAR') }
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							events.map(event => (
								<TableRow key={ event.eventId }>
									<TableCell>{ event.eventCode }</TableCell>
									<TableCell>{ event.secretCode }</TableCell>
									<TableCell>{ event.gameYear }</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</TableContainer>
		</main>
	);
}
