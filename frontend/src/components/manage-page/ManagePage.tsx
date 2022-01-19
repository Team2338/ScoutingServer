import './ManagePage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { Match } from '../../models/response.model';
import { AppState } from '../../models/states.model';
import { selectMatch } from '../../state/Actions';
import { getMatches } from '../../state/Effects';
import MatchDetail from './match-detail/MatchDetail';
import MatchList from './match-list/MatchList';


const inputs = (state: AppState) => ({
	isLoaded: state.matches.isLoaded,
	matches: state.matches.data,
	selectedMatch: state.matches.selectedMatch
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches(9999, 'test')),
	selectMatch: (match: Match) => dispatch(selectMatch(match))
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
				<div className="match-list-wrapper">
					<MatchList
						matches={this.props.matches}
						selectMatch={this.props.selectMatch}
						selectedMatch={this.props.selectedMatch}
					/>
				</div>
				<MatchDetail match={this.props.selectedMatch} />
			</div>
		);
	}
}

const ManagePage = connect(inputs, outputs)(ConnectedManagePage);
export default ManagePage;
