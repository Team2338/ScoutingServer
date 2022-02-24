import React from 'react';
import { connect, useSelector } from 'react-redux';
import { AppState } from '../models/states.model';

const translateKey = (language: string, key: string) => {
	const mapping = languages[language];

	if (mapping.hasOwnProperty(key)) {
		return mapping[key];
	}

	return key;
};

export const translate = (Component) => {
	const inputs = (state: AppState) => ({
		lang: state.language
	});

	class AddTranslator extends React.Component<any, any> {
		translate = (key: string) => {
			return translateKey(this.props.lang, key);
		}

		render() {
			return <Component translate={this.translate} {...this.props} />;
		}
	}

	return connect(inputs, null)(AddTranslator);
};

export const useTranslator = () => {
	const language = useSelector((state: AppState) => state.language);

	return (key: string) => translateKey(language, key);
};

const languages = {
	english: {
		'MATCH': 'Match',
		'MATCHES': 'Matches',
		'TEAM': 'Team',
		'TEAMS': 'Teams',
		'STATS': 'Stats',
		'DATA': 'Data',
		'LANGUAGE': 'Language',
		'LOGOUT': 'Logout',
		'SELECT_MATCH_VIEW_MORE_DETAILS': 'Select a match to view more details'
	},
	spanish: {
		'MATCH': 'Partido',
		'MATCHES': 'Partidos',
		'TEAM': 'Equipo',
		'TEAMS': 'Equipos',
		'STATS': 'Estadísticas',
		'DATA': 'Datos',
		'LANGUAGE': 'Lengua',
		'LOGOUT': 'Cerrar sesión',
		'SELECT_MATCH_VIEW_MORE_DETAILS': 'Seleccione un partido para ver más detalles'
	},
	french: {
		'MATCH': 'Match',
		'TEAM': 'Équipe',
		'STATS': 'Statistiques',
		'DATA': 'Les données',
		'LANGUAGE': 'Langue',
		'LOGOUT': 'Se déconnecter',
		'SELECT_MATCH_VIEW_MORE_DETAILS': 'Sélectionnez une correspondance pour afficher plus de détails'
	}
};
