import './Header.scss';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

interface IProps {
	teamNumber: number;
	eventCode: string;
}

export default function Header(props: IProps) {

	const downloadLink = `https://gearscout.patrickubelhor.com/api/v1/download/team/${props.teamNumber}/event/${props.eventCode}`;

	return (
		<AppBar id="appBar" position="sticky" color="primary">
			<Toolbar>
				<Typography variant="h5" color="inherit">GearScout</Typography>
				<a
					className="download-button"
					href={downloadLink}
					download
				>
					Download Data
				</a>
			</Toolbar>
		</AppBar>
	);
}
