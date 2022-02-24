import './Header.scss';
import {
	AppBar, Button,
	Drawer,
	Icon,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Toolbar,
	Typography
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AppState } from '../../models/states.model';
import { translate, useTranslator } from '../../service/TranslateService';
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
});

const outputs = (dispatch) => ({
	logout: () => dispatch(logout()),
	selectLanguage: (language: string) => dispatch(selectLanguage(language))
});

function ConnectedHeader(props) {

	const title = <Typography variant="h5" color="inherit" noWrap>GearScout</Typography>;
	const downloadLink = `https://gearscout.patrickubelhor.com/api/v1/team/${props.teamNumber}/event/${props.eventCode}/download`;

	const [isDrawerOpen, setDrawerOpen] = React.useState(false);
	const [accountAnchor, setAccountAnchor] = React.useState(null);

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

	const downloadButton = (
		<Button
			className="download-button"
			color="primary"
			disableElevation={true}
			variant="contained"
			aria-label="Download data"
			href={downloadLink}
			startIcon={<Icon>download</Icon>}
			download
		>
			{ props.translate('DATA') }
		</Button>
	);

	const accountButton = (
		<IconButton
			edge="end"
			color="inherit"
			aria-label="Account"
			aria-controls="account-menu"
			aria-haspopup="true"
			onClick={handleAccountMenuClick}
		>
			<Icon>account_circle</Icon>
		</IconButton>
	);

	const accountMenu = (
		<Menu
			id="account-menu"
			anchorEl={accountAnchor}
			open={Boolean(accountAnchor)}
			onClose={handleAccountMenuClose}
			keepMounted
		>
			<MenuItem onClick={handleLogout}>{ props.translate('LOGOUT') }</MenuItem>
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
		}
	];

	const routeComponents = routes.map((route: IRoute) => (
		<ListItem
			button
			key={route.name}
			component={NavLink}
			to={route.path}
			onClick={toggleDrawer(false)}
		>
			<ListItemIcon>
				<Icon>{ route.icon }</Icon>
			</ListItemIcon>
			<ListItemText primary={ props.translate(route.name) }/>
		</ListItem>
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
					<ListItem onClick={handleLogout} button>
						<ListItemIcon>
							<Icon>exit_to_app</Icon>
						</ListItemIcon>
						<ListItemText primary={ props.translate('LOGOUT') }/>
					</ListItem>
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
					{ downloadButton }
					{ accountButton }
					{ accountMenu }
				</Toolbar>
			</AppBar>
			{ drawer }
		</React.Fragment>
	);
}

const Header = connect(inputs, outputs)(ConnectedHeader);
export default translate(Header);

function LanguageSelector({ lang, onLanguageChange }) {

	const [languageAnchor, setLanguageAnchor] = React.useState(null);
	const translate = useTranslator();

	const handleLanguageMenuClick = (event) => {
		setLanguageAnchor(event.currentTarget);
	}

	const handleLanguageMenuClose = () => {
		setLanguageAnchor(null);
	}

	const handleLanguageChange = (language: string) => {
		onLanguageChange(language);
		handleLanguageMenuClose();
	}

	return (
		<React.Fragment>
			<Button
				className="language-button"
				color="primary"
				variant="contained"
				disableElevation={true}
				startIcon={<Icon>language</Icon>}
				onClick={handleLanguageMenuClick}
				aria-label="Change language"
				aria-controls="language-menu"
				aria-haspopup="true"
			>
				{ translate('LANGUAGE') }
			</Button>
			<Menu
				id="language-menu"
				anchorEl={languageAnchor}
				open={Boolean(languageAnchor)}
				onClose={handleLanguageMenuClose}
				keepMounted
			>
				<MenuItem
					selected={lang === 'english'}
					onClick={() => handleLanguageChange('english')}
				>
					English
				</MenuItem>
				<MenuItem
					selected={lang === 'spanish'}
					onClick={() => handleLanguageChange('spanish')}
				>
					Español
				</MenuItem>
				<MenuItem
					selected={lang === 'french'}
					onClick={() => handleLanguageChange('french')}
				>
					Français
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
