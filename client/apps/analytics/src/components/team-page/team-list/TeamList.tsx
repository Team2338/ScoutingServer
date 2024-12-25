import React, { useState } from 'react';
import { Divider, Icon, List, ListItemButton, Skeleton, Typography } from '@mui/material';
import { ImageState, Statelet, Team } from '../../../models';
import './TeamList.scss';
import { useTranslator } from '../../../service/TranslateService';
import SearchInput from '../../shared/search-input/SearchInput';
import { useSelectedTeam } from '../../../state/src/Selectors';
import { selectTeam, useAppDispatch, useAppSelector } from '../../../state';
import { LoadStatus } from '@gearscout/models';

interface IProps {
	teams: Team[];
}

export default function TeamList({ teams }: IProps) {

	const translate = useTranslator();
	const [searchTerm, setSearchTerm]: Statelet<string> = useState<string>('');
	const selectedTeam: Team = useSelectedTeam();
	const imageInfo: ImageState = useAppSelector(state => state.images);
	const getImage = (robotNumber: number) => {
		if (imageInfo.loadStatus === LoadStatus.loading) {
			return <Skeleton variant="rectangular" width={40} height={40} />;
		}

		if (imageInfo.loadStatus === LoadStatus.none || imageInfo.loadStatus === LoadStatus.failed) {
			return null;
		}

		if (imageInfo.images[robotNumber]?.url) {
			return (
				<div className="team-image-icon-wrapper">
					<img
						className="team-image-icon"
						alt=""
						role="presentation"
						src={ imageInfo.images[robotNumber].url }
					/>
				</div>
			);
		}

		return <div className="team-image-icon-missing"><Icon>question_mark</Icon></div>;
	};

	const userTeamNumber: number = useAppSelector(state => state.loginV2.selectedEvent.teamNumber);
	const isInspectionsEnabled: boolean = (userTeamNumber === 2338 || userTeamNumber === 9999); // TODO: move to service

	const dispatch = useAppDispatch();
	const _selectTeam = (team: Team) => dispatch(selectTeam(team.id));

	const listItems = teams
		.filter((team: Team) => String(team.id).includes(searchTerm))
		.map((team: Team, index: number) => {
			const listItem = (
				<ListItemButton
					key={ team.id }
					selected={ team.id === selectedTeam?.id }
					onClick={ () => _selectTeam(team) }
					sx={{
						paddingTop: '12px',
						paddingBottom: '12px'
					}}
				>
					<div className="team-list-item">
						{ isInspectionsEnabled && getImage(team.id) }
						<div>{ team.id }</div>
					</div>
				</ListItemButton>
			);

			if (index === 0) {
				return listItem;
			}

			return (
				<React.Fragment key={ team.id }>
					<Divider variant="fullWidth" component="li"/>
					{ listItem }
				</React.Fragment>
			);
		});

	return (
		<React.Fragment>
			<div className="team-list__header">
				<Typography
					variant="h6"
					sx={{
						marginBottom: '4px'
					}}
				>
					{ translate('TEAMS') }
				</Typography>
				<SearchInput onSearch={ setSearchTerm } size="small"/>
			</div>
			<Divider variant="fullWidth"/>
			<List>
				{ listItems }
			</List>
		</React.Fragment>
	);

}
