import React from 'react';
import { connect, useSelector } from 'react-redux';
import { ILanguageTranslation, Language } from '../models/languages.model';
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

const languages: ILanguageTranslation = {
	[Language.ENGLISH]: {
		"SIGN_IN": "Sign In",
		"YOUR_TEAM_NUMBER": "Your team number",
		"EVENT_CODE": "Event code",
		"SECRET_CODE": "Secret code",
		"MATCH": "Match",
		"MATCHES": "Matches",
		"TEAM": "Team",
		"TEAMS": "Teams",
		"STATS": "Stats",
		"DATA": "Data",
		"LANGUAGE": "Language",
		"LOGOUT": "Logout",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "Select a match to view more details",
		"MEAN": "Mean",
		"MEDIAN": "Median",
		"MODE": "Mode",
		"SCORES": "Scores",
		"SELECT_TEAM_VIEW_MORE_DETAILS": "Select a team to view more details",
		"VALUE": "Value",
		"SELECT_STAT_VIEW_MORE_DETAILS": "Select a statistic to view in-depth analysis",
		"ACCOUNT": "Account",
		"DOWNLOAD_DATA": "Download data",
		"DOWNLOAD_DATA_AS_CSV": "Download data as a CSV file",
		"CHANGE_LANGUAGE": "Change language",
		"EXCLUDE_FROM_STATS": "Exclude match data from team statistics",
		"INCLUDE_IN_STATS": "Include match data in team statistics",
		"HIDDEN": "Hidden",
		"AUTO": "Autonomous",
		"TELEOP": "Teleop",
		"HIGH_GOAL_2022": "High Goal",
		"LOW_GOAL_2022": "Low Goal",
		"MISS_GOAL_2022": "Missed Shot",
		"MOBILITY_2022": "Taxi",
		"CLIMB_2022": "Hangar",
	},
	[Language.SPANISH]: {
		"SIGN_IN": "Iniciar sesión",
		"YOUR_TEAM_NUMBER": "Tu numero de equipo",
		"EVENT_CODE": "Código del evento",
		"SECRET_CODE": "Código secreto",
		"MATCH": "Partido",
		"MATCHES": "Partidos",
		"TEAM": "Equipo",
		"TEAMS": "Equipos",
		"STATS": "Estadísticas",
		"DATA": "Datos",
		"LANGUAGE": "Lengua",
		"LOGOUT": "Cerrar sesión",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "Seleccione un partido para ver más detalles",
		"MEAN": "Media",
		"MEDIAN": "Mediana",
		"MODE": "Moda",
		"SCORES": "Anotaciones",
		"SELECT_TEAM_VIEW_MORE_DETAILS": "Seleccione un equipo para ver más detalles",
		"VALUE": "Valor",
		"SELECT_STAT_VIEW_MORE_DETAILS": "Seleccione una estadística para ver un análisis en profundidad",
		"ACCOUNT": "Cuenta",
		"DOWNLOAD_DATA": "Descargar datos",
		"DOWNLOAD_DATA_AS_CSV": "Descargar datos como archivo CSV",
		"CHANGE_LANGUAGE": "Cambiar idioma",
		"EXCLUDE_FROM_STATS": "Excluir datos de partidos de las estadísticas del equipo",
		"INCLUDE_IN_STATS": "Incluir datos de partidos en las estadísticas del equipo",
		"HIDDEN": "Oculto",
		"AUTO": "Auto", // TODO: or Autónomo?
		"TELEOP": "Teleop", // TODO: or Teledirigido
		"HIGH_GOAL_2022": "Núcleo Superior",
		"LOW_GOAL_2022": "Núcleo Inferior",
		"MISS_GOAL_2022": "Tiro fallado",
		"MOBILITY_2022": "Desplazamiento",
		"CLIMB_2022": "Hangar",
	},
	[Language.FRENCH]: {
		"SIGN_IN": "Connexion",
		"YOUR_TEAM_NUMBER": "Votre numéro d'équipe",
		"EVENT_CODE": "Code de l'événement",
		"SECRET_CODE": "Code secret",
		"MATCH": "Match",
		"MATCHES": "Matchs",
		"TEAM": "Équipe",
		"TEAMS": "Équipes",
		"STATS": "Statistiques",
		"DATA": "Les données",
		"LANGUAGE": "Langue",
		"LOGOUT": "Se déconnecter",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "Sélectionnez une match pour afficher plus de détails",
		"MEAN": "Moyenne",
		"MEDIAN": "Médiane",
		"MODE": "Mode",
		"SCORES": "Pointages",
		"SELECT_TEAM_VIEW_MORE_DETAILS": "Sélectionnez une équipe pour afficher plus de détails",
		"VALUE": "Évaluer",
		"SELECT_STAT_VIEW_MORE_DETAILS": "Sélectionnez une statistique pour afficher une analyse approfondie",
		"ACCOUNT": "Compte",
		"DOWNLOAD_DATA": "Télécharger les données",
		"DOWNLOAD_DATA_AS_CSV": "Télécharger les données sous forme de fichier CSV",
		"CHANGE_LANGUAGE": "Changer de langue",
		"EXCLUDE_FROM_STATS": "Exclure les données de match des statistiques de l'équipe",
		"INCLUDE_IN_STATS": "Inclure les données de match dans les statistiques de l'équipe",
		"HIDDEN": "Caché",
		"AUTO": "Auto", // TODO or autonome
		"TELEOP": "Téléop", // TODO: or télécommandée
		"HIGH_GOAL_2022": "Centre de Tri Supérieur",
		"LOW_GOAL_2022": "Centre de Tri Inférieur",
		"MISS_GOAL_2022": "Coup raté",
		"MOBILITY_2022": "Circulation",
		"CLIMB_2022": "Hangar",
	}
};
