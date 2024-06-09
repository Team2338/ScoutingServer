import './NavigationDrawer.scss';
import { Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslator } from '../../../service/TranslateService';

interface IProps {
	isDrawerOpen: boolean;
	title: React.JSX.Element;
	closeDrawer: () => void;
	handleLogout: () => void;
}

interface IRoute {
	path: string;
	name: string;
	icon: string;
}

export default function NavigationDrawer(props: IProps) {
	const translate = useTranslator();

	const routes: IRoute[] = [
		{
			path: '/events',
			name: 'EVENTS',
			icon: 'event'
		},
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
		},
		{
			path: '/inspections',
			name: 'INSPECTIONS',
			icon: 'assignment_turned_in'
		}
	];

	const routeComponents = routes.map((route: IRoute) => (
		<ListItemButton
			key={ route.name }
			component={ NavLink }
			to={ route.path }
			onClick={ props.closeDrawer }
		>
			<ListItemIcon>
				<Icon>{ route.icon }</Icon>
			</ListItemIcon>
			<ListItemText primary={ translate(route.name) } />
		</ListItemButton>
	));

	return (
		<Drawer className="nav-drawer" anchor="left" open={ props.isDrawerOpen } onClose={ props.closeDrawer }>
			<div className="nav-drawer-content">
				<div className="nav-drawer-header">
					{ props.title }
					<div>v{ import.meta.env.VITE_APP_VERSION }</div>
				</div>
				<div className="nav-drawer-divider" />
				<List>
					{ routeComponents }
					<ListItemButton onClick={ props.handleLogout }>
						<ListItemIcon>
							<Icon>exit_to_app</Icon>
						</ListItemIcon>
						<ListItemText primary={ translate('LOGOUT') } />
					</ListItemButton>
				</List>
			</div>
			<div className="copyright-notice" translate="no">
				© { new Date().getFullYear() } Gear it Forward
			</div>
		</Drawer>
	);
}
