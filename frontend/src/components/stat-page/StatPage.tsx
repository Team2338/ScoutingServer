import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';
import { getMatches, getTeams } from '../../state/Effects';

const inputs = (state: AppState) => ({

});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches()),
	getTeamStats: () => dispatch(getTeams()),
});

class ConnectedStatPage extends React.Component<any, any> {

	componentDidMount() {}

	render() {

		return (
			<div>Stat page!</div>
		)
	}
}

const StatPage = connect(inputs, outputs)(ConnectedStatPage);
export default StatPage;
