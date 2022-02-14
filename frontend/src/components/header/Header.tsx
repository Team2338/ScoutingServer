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

interface IProps {
	isLoggedIn: boolean
	teamNumber: number;
	eventCode: string;
}

export default function Header(props: IProps) {

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
			<MenuItem onClick={handleAccountMenuClose}>Logout</MenuItem>
		</Menu>
	)

	const drawer = (
		<Drawer className="nav-drawer" anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
			<div className="nav-drawer-content">
				<div className="nav-drawer-header">
					{ title }
					<div>v{process.env.REACT_APP_VERSION}</div>
				</div>
				<div className="nav-drawer-divider"/>
				<List>
					<ListItem button>
						<ListItemIcon>
							<Icon>storage</Icon>
						</ListItemIcon>
						<ListItemText primary="Manage"/>
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<Icon>assessment</Icon>
						</ListItemIcon>
						<ListItemText primary="Analyze"/>
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<Icon>exit_to_app</Icon>
						</ListItemIcon>
						<ListItemText primary="Logout"/>
					</ListItem>
				</List>
			{/*	Links to places */}
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
