import './Header.scss';
import {
	AppBar,
	Button,
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
	Tooltip,
	Typography
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Language } from '../../models/languages.model';
import { AppState } from '../../models/states.model';
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
			<ListItemText primary={ translate(route.name) }/>
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
						<ListItemText primary={ translate('LOGOUT') }/>
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
export default Header;

function LanguageSelector({ lang, onLanguageChange }: { lang: Language, onLanguageChange: (lang: Language) => void }) {

	const [languageAnchor, setLanguageAnchor] = React.useState(null);
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
				<MenuItem
					selected={lang === Language.ENGLISH}
					onClick={() => handleLanguageChange(Language.ENGLISH)}
					lang="en"
					translate="no"
				>
					English
				</MenuItem>
				<MenuItem
					selected={lang === Language.SPANISH}
					onClick={() => handleLanguageChange(Language.SPANISH)}
					lang="es"
					translate="no"
				>
					Español
				</MenuItem>
				<MenuItem
					selected={lang === Language.FRENCH}
					onClick={() => handleLanguageChange(Language.FRENCH)}
					lang="fr"
					translate="no"
				>
					Français
				</MenuItem>
				<MenuItem
					selected={lang === Language.TURKISH}
					onClick={() => handleLanguageChange(Language.TURKISH)}
					lang="tr"
					translate="no"
				>
					Türkçe
				</MenuItem>
				<MenuItem
					selected={lang === Language.HINDI}
					onClick={() => handleLanguageChange(Language.HINDI)}
					lang="hi"
					translate="no"
				>
					हिन्दी
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
