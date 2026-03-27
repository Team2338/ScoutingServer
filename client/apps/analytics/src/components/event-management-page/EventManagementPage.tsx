import './EventManagementPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { getEvents, selectEvent, useAppDispatch, useAppSelector } from '../../state';
import { IEventInfo, LoadStatus } from '@gearscout/shared-models';
import DataFailure from '../shared/data-failure/DataFailure';
import {
	IconButton,
	Menu,
	MenuItem,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { MoreVert } from '@mui/icons-material';

const StyledRow = styled(TableRow)(({ theme }) => ({
	['&.selected']: {
		backgroundColor: theme.palette.grey['100'],
		fontWeight: 'bold',
	}
}));

export default function EventManagementPage() {
	const translate = useTranslator();
	const dispatch = useAppDispatch();

	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.list);
	const selectedEvent: IEventInfo = useAppSelector(state => state.events.selectedEvent);

	const isRowSelected = useCallback(
		(event: IEventInfo) => event.eventId === selectedEvent.eventId,
		[selectedEvent]
	);

	useEffect(
		() => {
			if (eventLoadStatus === LoadStatus.none) {
				dispatch(getEvents());
			}
		},
		[dispatch, eventLoadStatus]
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
								{ translate('INSPECTIONS') }
							</TableCell>
							<TableCell align="right">
								{ translate('MATCHES') }
							</TableCell>
							<TableCell id="action-header" align="right">
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
									<TableCell align="right">{ event.inspectionCount }</TableCell>
									<TableCell align="right">{ event.matchCount }</TableCell>
									<TableCell align="right">
										<ActionButton event={ event } />
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

const ActionButton = ({ event }: { event: IEventInfo}) => {
	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpen = Boolean(anchorEl);

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleEventSelection = () => {
		dispatch(selectEvent(event));
		handleClose();
	};

	return (
		<Fragment>
			<IconButton
				id={ `action-button-${event.eventId}` }
				className="action-button"
				size="small"
				aria-controls={ isOpen ? 'basic-menu' : undefined }
				aria-haspopup="true"
				aria-expanded={ isOpen ? 'true' : undefined }
				aria-labelledby="action-header"
				onClick={ handleButtonClick }
			>
				<MoreVert/>
			</IconButton>
			<Menu
				id={ `action-menu-${event.eventId}` }
				anchorEl={ anchorEl }
				open={ isOpen }
				onClose={ handleClose }
			>
				<MenuItem onClick={ handleEventSelection }>
					{ translate('SWITCH_TO_EVENT') }
				</MenuItem>
			</Menu>
		</Fragment>
	);
};
