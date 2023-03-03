import './TeamPage.scss';
import { useMediaQuery } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { Team } from '../../models/response.model';
import { AppState } from '../../models/states.model';
import { useTranslator } from '../../service/TranslateService';
import { selectTeam } from '../../state/Actions';
import { getMatches, getTeams } from '../../state/Effects';
import { useAppDispatch, useAppSelector } from '../../state/Hooks';
import { TeamSelector } from '../shared/team-selector/TeamSelector';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';

const inputs = (state: AppState) => ({
	areMatchesLoaded: state.matches.isLoaded,
	areTeamsLoaded: state.teams.isLoaded,
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams()),
});

class ConnectedTeamPage extends React.Component<any, any> {

	componentDidMount() {
		if (!this.props.areMatchesLoaded) {
			this.props.getMatches();

			return;
		}

		if (!this.props.areTeamsLoaded) {
			this.props.getTeamStats();
		}
	}

	render() {
		return (
			<TeamPageContent/>
		);
	}
}

function TeamPageContent() {
	const dispatch = useAppDispatch();
	const _selectTeam = (team: Team) => dispatch(selectTeam(team));
	const translate = useTranslator();
	const isMobile: boolean = useMediaQuery('(max-width: 600px)');
	const areTeamsLoaded: boolean = useAppSelector(state => state.teams.isLoaded);
	const teams: Team[] = useAppSelector(state => state.teams.data);
	const selectedTeam: Team = useAppSelector(state => state.teams.selectedTeam);

	if (!areTeamsLoaded) {
		return <div className="team-page">{ translate('LOADING') }</div>;
	}

	if (isMobile) {
		return (
			<div className="page team-page-mobile">
				<div className="team-detail-wrapper">
					<TeamSelector
						teams={teams}
						selectTeam={_selectTeam}
						selectedTeam={selectedTeam}
					/>
					<TeamDetail team={selectedTeam}/>
				</div>
			</div>
		);
	}

	return (
		<div className="page team-page">
			<div className="team-list-wrapper">
				<TeamList
					teams={teams}
					selectTeam={_selectTeam}
					selectedTeam={selectedTeam}
				/>
			</div>
			<div className="team-detail-wrapper">
				<TeamDetail team={selectedTeam}/>
			</div>
		</div>
	);
}


const TeamPage = connect(inputs, outputs)(ConnectedTeamPage);
export default TeamPage;
