import './Header.scss';
import {
	AppBar,
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
import { logout } from '../../state/Effects';


interface IRoute {
	path: string;
	name: string;
	icon: string;
}

const inputs = (state: AppState) => ({
	isLoggedIn: state.isLoggedIn,
	teamNumber: state.teamNumber,
	eventCode: state.eventCode
});

const outputs = (dispatch) => ({
	logout: () => dispatch(logout())
});

function ConnectedHeader(props) {

	const title = <Typography variant="h5" color="inherit" noWrap>GearScout</Typography>;
	const downloadLink = `https://gearscout.patrickubelhor.com/api/v1/team/${props.teamNumber}/event/${props.eventCode}/download`;

	const [isDrawerOpen, setDrawerOpen] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const isAccountMenuOpen = Boolean(anchorEl);

	const toggleDrawer = (isOpen: boolean) => () => setDrawerOpen(isOpen);

	const handleAccountMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	}

	const handleAccountMenuClose = () => {
		setAnchorEl(null);
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
				</Toolbar>
			</AppBar>
		)
	}

	const downloadButton = (
		<a className="download-button" href={downloadLink} download>
			Download Data
		</a>
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
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right'
			}}
			open={isAccountMenuOpen}
			onClose={handleAccountMenuClose}
			keepMounted
		>
			<MenuItem onClick={handleLogout}>Logout</MenuItem>
		</Menu>
	);

	const routes: IRoute[] = [
		{
			path: '/matches',
			name: 'Matches',
			icon: 'list'
		},
		{
			path: '/teams',
			name: 'Teams',
			icon: 'groups'
		},
		{
			path: '/stats',
			name: 'Stats',
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
			<ListItemText primary={route.name}/>
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
						<ListItemText primary="Logout"/>
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
