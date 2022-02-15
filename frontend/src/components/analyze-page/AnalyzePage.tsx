import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../models/states.model';

const inputs = (state: AppState) => ({

});

const outputs = (dispatch) => ({

});

class ConnectedAnalyzePage extends React.Component<any, any> {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>Analyze Performance</div>
		);
	}

}

const AnalyzePage = connect(inputs, outputs)(ConnectedAnalyzePage);
export default AnalyzePage;
