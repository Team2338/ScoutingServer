import './ManagePage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { Match } from '../../models/response.model';
import { AppState } from '../../models/states.model';
import { selectMatch } from '../../state/Actions';
import { getMatches, hideMatch, unhideMatch } from '../../state/Effects';
import MatchDetail from './match-detail/MatchDetail';
import MatchList from './match-list/MatchList';


const inputs = (state: AppState) => ({
	isLoaded: state.matches.isLoaded,
	matches: state.matches.data,
	selectedMatch: state.matches.selectedMatch
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches('test')),
	selectMatch: (match: Match) => dispatch(selectMatch(match)),
	hideMatch: (match: Match) => dispatch(hideMatch(match)),
	unhideMatch: (match: Match) => dispatch(unhideMatch(match))
});

class ConnectedManagePage extends React.Component<any, any> {

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		this.props.getMatches();
	}

	render() {
		if (!this.props.isLoaded) {
			return <div className="manage-page">Loading...</div>;
		}

		return (
			<div className="manage-page">
				<a href="https://gearscout.patrickubelhor.com/api/v1/download/team/9999/event/test" download>Download</a>
				<div className="match-list-wrapper">
					<MatchList
						matches={this.props.matches}
						selectMatch={this.props.selectMatch}
						selectedMatch={this.props.selectedMatch}
					/>
				</div>
				<MatchDetail
					match={this.props.selectedMatch}
					hide={this.props.hideMatch}
					unhide={this.props.unhideMatch}
				/>
			</div>
		);
	}
}

const ManagePage = connect(inputs, outputs)(ConnectedManagePage);
export default ManagePage;
