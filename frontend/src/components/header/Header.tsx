import {
	AppBar,
	Icon,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
	useMediaQuery
} from '@mui/material';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { EventInfo, Statelet } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { logout, useAppDispatch, useAppSelector, useIsLoggedInSelector } from '../../state';
import './Header.scss';
import ProfileCard from '../shared/profile-card/ProfileCard';
import { ExitToApp } from '@mui/icons-material';
import DownloadButton from './download-button/DownloadButton';
import LanguageSelector from './language-selector/LanguageSelector';
import NavigationDrawer from './navigation-drawer/NavigationDrawer';


export default function Header() {

	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const isMobile: boolean = useMediaQuery('(max-width: 600px)');

	const _logout = () => dispatch(logout());
	const isLoggedIn: boolean = useIsLoggedInSelector();
	const selectedEvent: EventInfo = useAppSelector(state => state.loginV2.selectedEvent);

	const [isDrawerOpen, setDrawerOpen]: Statelet<boolean> = useState<boolean>(false);
	const [accountAnchor, setAccountAnchor]: Statelet<Element> = useState(null);

	const toggleDrawer = (isOpen: boolean) => () => setDrawerOpen(isOpen);

	const handleAccountMenuClick = (event): void => {
		setAccountAnchor(event.currentTarget);
	};

	const handleAccountMenuClose = (): void => {
		setAccountAnchor(null);
	};

	const handleLogout = (): void => {
		setDrawerOpen(false);
		handleAccountMenuClose();
		_logout();
	};

	const title = (
		<Typography
			variant="h5"
			color="inherit"
			lang="en"
			translate="no"
			noWrap
		>
			GearScout
		</Typography>
	);

	if (!isLoggedIn) {
		return (
			<AppBar id="appBar" position="sticky" color="primary">
				<Toolbar>
					{ title }
					<LanguageSelector id="language-button" />
				</Toolbar>
			</AppBar>
		);
	}

	const accountButton = (
		<Tooltip title={ translate('ACCOUNT') }>
			<IconButton
				edge="end"
				color="inherit"
				aria-label={ translate('ACCOUNT') }
				aria-controls="account-menu"
				aria-haspopup="true"
				onClick={ handleAccountMenuClick }
			>
				<Icon>account_circle</Icon>
			</IconButton>
		</Tooltip>
	);

	// TODO: Make profile link route to /matches for guests
	const accountMenu = (
		<Menu
			id="account-menu"
			anchorEl={ accountAnchor }
			open={ Boolean(accountAnchor) }
			onClose={ handleAccountMenuClose }
			keepMounted
		>
			{
				selectedEvent &&
				<NavLink className="profile-card-link" to="/events" onClick={ handleAccountMenuClose }>
					<ProfileCard sx={{ margin: '8px 12px' }} />
				</NavLink>
			}
			<MenuItem onClick={ handleLogout }>
				<ListItemIcon>
					{/*<Icon>exit_to_app</Icon>*/}
					<ExitToApp />
				</ListItemIcon>
				<ListItemText>
					{ translate('LOGOUT') }
				</ListItemText>
			</MenuItem>
		</Menu>
	);

	if (!selectedEvent) {
		return (
			<AppBar id="appBar" position="sticky" color="primary">
				<Toolbar>
					{ title }
					<LanguageSelector id="language-button" />
					{ accountButton }
					{ accountMenu }
				</Toolbar>
			</AppBar>
		);
	}

	return (
		<React.Fragment>
			<AppBar id="appBar" position="sticky" color="primary">
				<Toolbar>
					<IconButton
						className="menu-button"
						onClick={ toggleDrawer(true) }
						edge="start"
						color="inherit"
						aria-label="menu"
					>
						<Icon>menu</Icon>
					</IconButton>
					{ title }
					<LanguageSelector id="language-button" />
					{ isMobile ? null : <DownloadButton /> }
					{ accountButton }
					{ accountMenu }
				</Toolbar>
			</AppBar>
			<NavigationDrawer
				isDrawerOpen={ isDrawerOpen }
				title={ title }
				closeDrawer={ toggleDrawer(false) }
				handleLogout={ handleLogout }
			/>
		</React.Fragment>
	);
}
