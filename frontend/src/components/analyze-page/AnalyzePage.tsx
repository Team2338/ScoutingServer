import './AnalyzePage.scss';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';
import { getMatches } from '../../state/Effects';
import TeamDetail from './team-detail/TeamDetail';
import TeamList from './team-list/TeamList';

const inputs = (state: AppState) => ({
	isLoaded: state.matches.isLoaded,
	matches: state.matches.data
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches())
});

class ConnectedAnalyzePage extends React.Component<any, any> {

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		if (!this.props.isLoaded) {
			this.props.getMatches();
		}
	}

	render() {
		if (!this.props.isLoaded) {
			return <div className="analyze-page">Loading...</div>;
		}

		return (
			<div className="page analyze-page">
				<div className="team-list-wrapper">
					<TeamList/>
				</div>
				<TeamDetail/>
			</div>
		);
	}

}

const AnalyzePage = connect(inputs, outputs)(ConnectedAnalyzePage);
export default AnalyzePage;
