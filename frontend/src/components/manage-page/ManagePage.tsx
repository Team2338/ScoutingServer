import './ManagePage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';
import { getMatches } from '../../state/Effects';
import MatchList from './match-list/MatchList';


const inputs = (state: AppState) => ({
	isLoaded: state.matches.isLoaded,
	matches: state.matches.data
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches(9999, 'test'))
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
					<MatchList matches={this.props.matches} />
				</div>
			</div>
		);
	}
}

const ManagePage = connect(inputs, outputs)(ConnectedManagePage);
export default ManagePage;
