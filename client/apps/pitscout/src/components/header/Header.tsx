import React, { useState } from 'react';
import './Header.scss';
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
	Typography
} from '@mui/material';
import { logout, selectIsLoggedIn, useAppDispatch, useAppSelector } from '../../state';
import { ExitToApp, Shuffle } from '@mui/icons-material';
import ProfileCard from './profile-card/ProfileCard';
import { NavLink } from 'react-router-dom';
import {
	IEventInfo,
	IUserInfo
} from '@gearscout/models';

export default function Header() {
	const dispatch = useAppDispatch();
	const isLoggedIn: boolean = useAppSelector(selectIsLoggedIn);
	const user: IUserInfo = useAppSelector(state => state.loginv2.user);
	const selectedEvent: IEventInfo = useAppSelector(state => state.events.selectedEvent);

	const [accountAnchor, setAccountAnchor] = useState(null);
	const handleAccountMenuClick = (event) => setAccountAnchor(event.currentTarget);
	const handleAccountMenuClose = () => setAccountAnchor(null);

	const _logout = () => {
		handleAccountMenuClose();
		dispatch(logout());
	};

	const accountButton = (
		<Tooltip title="Account">
			<IconButton
				id="account-button"
				edge="end"
				color="inherit"
				aria-label="Account"
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
			keepMounted={ true }
		>
			<ProfileCard
				sx={{ margin: '8px 12px' }}
				user={ user }
				selectedEvent={ selectedEvent }
			/>
			{
				selectedEvent &&
				<NavLink id="switch-event-link" to="/events" onClick={ handleAccountMenuClose }>
					<MenuItem>
						<ListItemIcon>
							<Shuffle />
						</ListItemIcon>
						<ListItemText>
							Switch events
						</ListItemText>
					</MenuItem>
				</NavLink>
			}
			<MenuItem onClick={ _logout }>
				<ListItemIcon>
					<ExitToApp />
				</ListItemIcon>
				<ListItemText>
					Logout
				</ListItemText>
			</MenuItem>
		</Menu>
	);

	return (
		<AppBar id="app-bar" position="sticky" color="primary">
			<Toolbar>
				<div className="name-and-version">
					<Typography
						variant="h5"
						color="inherit"
						lang="en"
						translate="no"
						noWrap
					>
						PitScout
					</Typography>
					<span>{ import.meta.env.VITE_APP_VERSION }</span>
				</div>
				{ isLoggedIn && accountButton }
				{ isLoggedIn && accountMenu }
			</Toolbar>
		</AppBar>
	);
}
