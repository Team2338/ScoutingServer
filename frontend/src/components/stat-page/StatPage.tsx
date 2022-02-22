import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';

const inputs = (state: AppState) => ({

});

const outputs = (dispatch) => ({

});

class ConnectedStatPage extends React.Component<any, any> {

	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {

		return (
			<div>Stat page!</div>
		)
	}
}

const StatPage = connect(inputs, outputs)(ConnectedStatPage);
export default StatPage;
