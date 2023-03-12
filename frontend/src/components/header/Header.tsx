import './Header.scss';
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
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AppState, Language, LanguageDescriptor, LanguageInfo } from '../../models';
import { useTranslator } from '../../service/TranslateService';
import { logout, selectLanguage } from '../../state/Effects';


interface IRoute {
	path: string;
	name: string;
	icon: string;
}

const inputs = (state: AppState) => ({
	isLoggedIn: state.isLoggedIn,
	teamNumber: state.teamNumber,
	eventCode: state.eventCode,
	csv: state.csv
});

const outputs = (dispatch) => ({
	logout: () => dispatch(logout()),
	selectLanguage: (language: Language) => dispatch(selectLanguage(language))
});

function ConnectedHeader(props) {

	const translate = useTranslator();
	const isMobile = useMediaQuery('(max-width: 600px)');
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [accountAnchor, setAccountAnchor] = useState(null);

	const toggleDrawer = (isOpen: boolean) => () => setDrawerOpen(isOpen);

	const handleAccountMenuClick = (event) => {
		setAccountAnchor(event.currentTarget);
	}

	const handleAccountMenuClose = () => {
		setAccountAnchor(null);
	}

	const handleLogout = () => {
		setDrawerOpen(false);
		handleAccountMenuClose();
		props.logout();
	}

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
	const filename = props.teamNumber + '_' + props.eventCode + '.csv';

	if (!props.isLoggedIn) {
		return (
			<AppBar id="appBar" position="sticky" color="primary">
				<Toolbar>
					{ title }
					<LanguageSelector lang={props.lang} onLanguageChange={props.selectLanguage} />
				</Toolbar>
			</AppBar>
		);
	}

	/*
	 * How to download text file with React
	 * https://dev.to/imjoshellis/simple-download-text-file-link-with-react-29j3
	 */
	const downloadButton = (
		<Tooltip title={ translate('DOWNLOAD_DATA_AS_CSV') } >
			<Button
				className="download-button"
				color="primary"
				disableElevation={true}
				variant="contained"
				aria-label={ translate('DOWNLOAD_DATA') }
				startIcon={<Icon>download</Icon>}
				href={props.csv.url}
				download={filename}
				disabled={!props.csv.isLoaded}
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
				onClick={handleAccountMenuClick}
			>
				<Icon>account_circle</Icon>
			</IconButton>
		</Tooltip>
	);

	const accountMenu = (
		<Menu
			id="account-menu"
			anchorEl={accountAnchor}
			open={Boolean(accountAnchor)}
			onClose={handleAccountMenuClose}
			keepMounted
		>
			<MenuItem onClick={handleLogout}>{ translate('LOGOUT') }</MenuItem>
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
			key={route.name}
			component={NavLink}
			to={route.path}
			onClick={toggleDrawer(false)}
		>
			<ListItemIcon>
				<Icon>{ route.icon }</Icon>
			</ListItemIcon>
			<ListItemText primary={ translate(route.name) }/>
		</ListItemButton>
	));

	const drawer = (
		<Drawer className="nav-drawer" anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
			<div className="nav-drawer-content">
				<div className="nav-drawer-header">
					{ title }
					<div>v{process.env.REACT_APP_VERSION}</div>
				</div>
				<div className="nav-drawer-divider"/>
				<List>
					{ routeComponents }
					<ListItemButton onClick={handleLogout}>
						<ListItemIcon>
							<Icon>exit_to_app</Icon>
						</ListItemIcon>
						<ListItemText primary={ translate('LOGOUT') }/>
					</ListItemButton>
				</List>
			</div>
		</Drawer>
	);

	return (
		<React.Fragment>
			<AppBar id="appBar" position="sticky" color="primary">
				<Toolbar>
					<IconButton
						className="menu-button"
						onClick={toggleDrawer(true)}
						edge="start"
						color="inherit"
						aria-label="menu"
					>
						<Icon>menu</Icon>
					</IconButton>
					{ title }
					<LanguageSelector lang={props.lang} onLanguageChange={props.selectLanguage} />
					{ isMobile ? null : downloadButton }
					{ accountButton }
					{ accountMenu }
				</Toolbar>
			</AppBar>
			{ drawer }
		</React.Fragment>
	);
}

const Header = connect(inputs, outputs)(ConnectedHeader);
export default Header;

function LanguageSelector({ lang, onLanguageChange }: { lang: Language, onLanguageChange: (lang: Language) => void }) {

	const [languageAnchor, setLanguageAnchor] = useState(null);
	const translate = useTranslator();

	const handleLanguageMenuClick = (event) => {
		setLanguageAnchor(event.currentTarget);
	}

	const handleLanguageMenuClose = () => {
		setLanguageAnchor(null);
	}

	const handleLanguageChange = (language: Language) => {
		onLanguageChange(language);
		handleLanguageMenuClose();
	}

	const languageOptions: ReactElement[] = Object.values(LanguageInfo)
		.map((info: LanguageDescriptor) => (
			<MenuItem
				key={info.key}
				lang={info.code}
				translate="no"
				selected={lang === info.key}
				onClick={() => handleLanguageChange(info.key)}
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
					disableElevation={true}
					startIcon={<Icon>language</Icon>}
					onClick={handleLanguageMenuClick}
					aria-label={ translate('CHANGE_LANGUAGE') }
					aria-controls="language-menu"
					aria-haspopup="true"
				>
					{ translate('LANGUAGE') }
				</Button>
			</Tooltip>
			<Menu
				id="language-menu"
				anchorEl={languageAnchor}
				open={Boolean(languageAnchor)}
				onClose={handleLanguageMenuClose}
				keepMounted
			>
				{ languageOptions }
				{/*<MenuItem*/}
				{/*	selected={lang === Language.HINDI}*/}
				{/*	onClick={() => handleLanguageChange(Language.HINDI)}*/}
				{/*	lang="hi"*/}
				{/*	translate="no"*/}
				{/*>*/}
				{/*	हिन्दी*/}
				{/*</MenuItem>*/}
			</Menu>
		</React.Fragment>
	);
}
