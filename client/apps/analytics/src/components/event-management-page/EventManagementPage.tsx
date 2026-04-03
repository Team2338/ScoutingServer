import './EventManagementPage.scss';
import { useTranslator } from '../../service/TranslateService';
import { getEvents, hideEvent, selectEvent, unhideEvent, useAppDispatch, useAppSelector } from '../../state';
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
	TableRow, ToggleButton, ToggleButtonGroup, Tooltip
} from '@mui/material';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { MoreVert, Visibility, VisibilityOff } from '@mui/icons-material';

const StyledRow = styled(TableRow)(({ theme }) => ({
	['&.selected']: {
		backgroundColor: theme.palette.grey['100'],

		['> td']: {
			fontWeight: 'bold',
		}
	}
}));

export default function EventManagementPage() {
	const translate = useTranslator();
	const dispatch = useAppDispatch();

	const eventLoadStatus: LoadStatus = useAppSelector(state => state.events.loadStatus);
	const events: IEventInfo[] = useAppSelector(state => state.events.list);
	const selectedEvent: IEventInfo = useAppSelector(state => state.events.selectedEvent);

	const [shouldShowHidden, setShouldShowHidden] = useState(false);
	const filteredEvents: IEventInfo[] = events.filter(event => event.isHidden === shouldShowHidden);

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
			<div className="header-wrapper">
				<h2 className="page-title">{ translate('EVENTS') }</h2>
				<ToggleButtonGroup
					value={ shouldShowHidden }
					exclusive={ true }
					size="small"
					aria-label={ translate('EVENT_VISIBILITY') }
					onChange={ (_event, value) => setShouldShowHidden(value) }
				>
					<Tooltip title={ translate('SHOW_ONLY_VALID_EVENTS') } >
						<ToggleButton value={ false } aria-label={ translate('SHOW_ONLY_VALID_EVENTS') }>
							<Visibility />
						</ToggleButton>
					</Tooltip>
					<Tooltip title={ translate('SHOW_ONLY_HIDDEN_EVENTS') }>
						<ToggleButton value={ true } aria-label={ translate('SHOW_ONLY_HIDDEN_EVENTS') }>
							<VisibilityOff />
						</ToggleButton>
					</Tooltip>
				</ToggleButtonGroup>
			</div>
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
							filteredEvents.map(event => (
								<StyledRow key={ event.eventId } className={ isRowSelected(event) ? 'selected': '' }>
									<TableCell>{ event.eventCode }</TableCell>
									<TableCell>{ event.secretCode }</TableCell>
									<TableCell align="center">{ event.gameYear }</TableCell>
									<TableCell align="right">{ event.inspectionCount }</TableCell>
									<TableCell align="right">{ event.matchCount }</TableCell>
									<TableCell align="right">
										<ActionButton event={ event } isSelected={ isRowSelected(event) }/>
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

const ActionButton = ({ event, isSelected }: { event: IEventInfo, isSelected: boolean }) => {
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

	const handleEventHide = () => {
		if (event.isHidden) {
			dispatch(unhideEvent(event));
			handleClose();
			return;
		}

		dispatch(hideEvent(event));
		handleClose();
	};

	return (
		<Fragment>
			<IconButton
				id={ `action-button-${ event.eventId }` }
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
				id={ `action-menu-${ event.eventId }` }
				anchorEl={ anchorEl }
				open={ isOpen }
				onClose={ handleClose }
			>
				<MenuItem onClick={ handleEventSelection }>
					{ translate('SWITCH_TO_EVENT') }
				</MenuItem>
				<MenuItem onClick={ handleEventHide } disabled={ isSelected }>
					{ translate(event.isHidden ? 'UNHIDE_EVENT' : 'HIDE_EVENT')}
				</MenuItem>
			</Menu>
		</Fragment>
	);
};
