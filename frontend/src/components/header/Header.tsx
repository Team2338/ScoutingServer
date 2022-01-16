import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

interface IProps {

}

export default function Header(props: IProps) {

	return (
		<AppBar id="appBar" position="sticky" color="primary">
			<Toolbar>
				<Typography variant="h5" color="inherit">GearScout</Typography>
			</Toolbar>
		</AppBar>
	);
}
