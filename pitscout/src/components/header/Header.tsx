import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { logout, selectIsLoggedIn, useAppDispatch, useAppSelector } from '../../state';

export default function Header() {
	const isLoggedIn: boolean = useAppSelector(selectIsLoggedIn);

	const dispatch = useAppDispatch();
	const _logout = () => dispatch(logout());

	const logoutButton = (
		<Button
			className="logout-button"
			color="primary"
			disableElevation={true}
			variant="contained"
			aria-label="Logout"
			onClick={_logout}
			sx={{
				marginLeft: 'auto'
			}}
		>
			Logout
		</Button>
	);

	return (
		<AppBar id="app-bar" position="sticky" color="primary">
			<Toolbar>
				<Typography
					variant="h5"
					color="inherit"
					lang="en"
					translate="no"
					noWrap
				>
					PitScout
				</Typography>
				{ isLoggedIn ? logoutButton : null }
			</Toolbar>
		</AppBar>
	);
}
