import './Header.scss';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

interface IProps {
	isLoggedIn: boolean
	teamNumber: number;
	eventCode: string;
}

export default function Header(props: IProps) {

	const downloadLink = `https://gearscout.patrickubelhor.com/api/v1/team/${props.teamNumber}/event/${props.eventCode}/download`;

	const downloadElement = props.isLoggedIn
		? (
			<a className="download-button" href={downloadLink} download>
				Download Data
			</a>
		)
		: null;

	return (
		<AppBar id="appBar" position="sticky" color="primary">
			<Toolbar>
				<Typography variant="h5" color="inherit">GearScout</Typography>
				{downloadElement}
			</Toolbar>
		</AppBar>
	);
}
