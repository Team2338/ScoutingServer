import './App.css';
import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../models/states.model';
import { getMatches } from '../state/Effects';


const select = (state: AppState) => ({
	isLoaded: state.matches.isLoaded,
	matches: state.matches.data
});

const outputs = (dispatch) => ({
	getMatches: () => dispatch(getMatches(9999, 'test'))
});


class ConnectedApp extends React.Component<any, any> {

	componentDidMount() {
		this.props.getMatches();
	}

	render() {
		const content: string = this.props.isLoaded ? JSON.stringify(this.props.matches) : 'Loading...';

		return (
			<div>{ content }</div>
		);
	}

}

const App = connect(select, outputs)(ConnectedApp);
export default App;
