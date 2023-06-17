import {
	AppBar,
	Button,
	Drawer,
	Icon,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
	useMediaQuery
} from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Language, LanguageDescriptor, LanguageInfo, LoadStatus } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { logout, selectLanguage, useAppDispatch, useAppSelector } from '../../state';
import './Header.scss';
import ProfileCard from '../shared/profile-card/ProfileCard';
import { ExitToApp } from '@mui/icons-material';


interface IRoute {
	path: string;
	name: string;
	icon: string;
}

export default function Header() {

	const translate = useTranslator();
	const dispatch = useAppDispatch();
	const isMobile: boolean = useMediaQuery('(max-width: 600px)');

	const _logout = () => dispatch(logout());
	const isLoggedIn: boolean = useAppSelector(state => state.isLoggedIn);
	const teamNumber: number = useAppSelector(state => state.teamNumber);
	const eventCode: string = useAppSelector(state => state.eventCode);
	const csv = useAppSelector(state => state.csv);

	const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [accountAnchor, setAccountAnchor] = useState(null);

	const toggleDrawer = (isOpen: boolean) => () => setDrawerOpen(isOpen);

	const handleAccountMenuClick = (event) => {
		setAccountAnchor(event.currentTarget);
	};

	const handleAccountMenuClose = () => {
		setAccountAnchor(null);
	};

	const handleLogout = () => {
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
	const filename: string = teamNumber + '_' + eventCode + '.csv';

	if (!isLoggedIn) {
		return (
			<AppBar id="appBar" position="sticky" color="primary">
				<Toolbar>
					{ title }
					<LanguageSelector />
				</Toolbar>
			</AppBar>
		);
	}

	/*
	 * How to download text file with React
	 * https://dev.to/imjoshellis/simple-download-text-file-link-with-react-29j3
	 */
	const downloadButton = (
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

	const accountMenu = (
		<Menu
			id="account-menu"
			anchorEl={ accountAnchor }
			open={ Boolean(accountAnchor) }
			onClose={ handleAccountMenuClose }
			keepMounted
		>
			<ProfileCard sx={{ margin: '8px 12px' }} />
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

	const routes: IRoute[] = [
		{
			path: '/matches',
			name: 'MATCHES',
			icon: 'list'
		},
		{
			path: '/teams',
			name: 'TEAMS',
			icon: 'groups'
		},
		{
			path: '/stats',
			name: 'STATS',
			icon: 'leaderboard'
		},
		{
			path: '/plan',
			name: 'PLAN',
			icon: 'mediation'
		}
	];

	const routeComponents = routes.map((route: IRoute) => (
		<ListItemButton
			key={ route.name }
			component={ NavLink }
			to={ route.path }
			onClick={ toggleDrawer(false) }
		>
			<ListItemIcon>
				<Icon>{ route.icon }</Icon>
			</ListItemIcon>
			<ListItemText primary={ translate(route.name) } />
		</ListItemButton>
	));

	const drawer = (
		<Drawer className="nav-drawer" anchor="left" open={ isDrawerOpen } onClose={ toggleDrawer(false) }>
			<div className="nav-drawer-content">
				<div className="nav-drawer-header">
					{ title }
					<div>v{ process.env.REACT_APP_VERSION }</div>
				</div>
				<div className="nav-drawer-divider" />
				<List>
					{ routeComponents }
					<ListItemButton onClick={ handleLogout }>
						<ListItemIcon>
							<Icon>exit_to_app</Icon>
						</ListItemIcon>
						<ListItemText primary={ translate('LOGOUT') } />
					</ListItemButton>
				</List>
			</div>
			<div className="copyright-notice" translate="no">
				© { new Date().getFullYear() } Gear it Forward
			</div>
		</Drawer>
	);

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
					<LanguageSelector />
					{ isMobile ? null : downloadButton }
					{ accountButton }
					{ accountMenu }
				</Toolbar>
			</AppBar>
			{ drawer }
		</React.Fragment>
	);
}


function LanguageSelector() {

	const dispatch = useAppDispatch();
	const selectedLanguage: Language = useAppSelector(state => state.language);
	const [languageAnchor, setLanguageAnchor] = useState(null);
	const translate = useTranslator();

	const handleLanguageMenuClick = (event) => {
		setLanguageAnchor(event.currentTarget);
	};

	const handleLanguageMenuClose = () => {
		setLanguageAnchor(null);
	};

	const handleLanguageChange = (language: Language) => {
		dispatch(selectLanguage(language));
		handleLanguageMenuClose();
	};

	const languageOptions: ReactElement[] = Object.values(LanguageInfo)
		.map((info: LanguageDescriptor) => (
			<MenuItem
				key={ info.key }
				lang={ info.code }
				translate="no"
				selected={ selectedLanguage === info.key }
				onClick={ () => handleLanguageChange(info.key) }
			>
				{ info.localName }
			</MenuItem>
		));

	return (
		<React.Fragment>
			<Tooltip title={ translate('CHANGE_LANGUAGE') }>
				<Button
					className="language-button"
					color="primary"
					variant="contained"
					disableElevation={ true }
					startIcon={ <Icon>language</Icon> }
					onClick={ handleLanguageMenuClick }
					aria-label={ translate('CHANGE_LANGUAGE') }
					aria-controls="language-menu"
					aria-haspopup="true"
				>
					{ translate('LANGUAGE') }
				</Button>
			</Tooltip>
			<Menu
				id="language-menu"
				anchorEl={ languageAnchor }
				open={ Boolean(languageAnchor) }
				onClose={ handleLanguageMenuClose }
				keepMounted
			>
				{ languageOptions }
			</Menu>
		</React.Fragment>
	);
}
