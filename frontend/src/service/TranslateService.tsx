import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../models/states.model';

export const translate = (Component) => {
	const inputs = (state: AppState) => ({
		lang: state.language
	});

	class AddTranslator extends React.Component<any, any> {
		constructor(props) {
			super(props);
		}

		componentDidMount() {
			console.log('using translator')
		}

		translate = (key: string) => {
			return languages[this.props.lang][key];
		}

		render() {
			return <Component translate={this.translate} {...this.props} />;
		}
	}

	return connect(inputs, null)(AddTranslator);
};

const languages = {
	english: {
		'HELLO_WORLD': 'Hello world',
		'MATCH': 'Match',
		'TEAM': 'Team',
		'DATA': 'Data',
		'LANGUAGE': 'Language',
		'SELECT_MATCH_VIEW_MORE_DETAILS': 'Select a match to view more details'
	},
	spanish: {
		'HELLO_WORLD': 'Hola mundo',
		'MATCH': 'Partido',
		'TEAM': 'Equipo',
		'DATA': 'Datos',
		'LANGUAGE': 'Lengua',
		'SELECT_MATCH_VIEW_MORE_DETAILS': 'Translation works'
	},
	french: {
		'HELLO_WORLD': 'Bonjour le monde',
		'MATCH': 'Match',
		'TEAM': 'Équipe',
		'DATA': 'Les données'
	}
}
