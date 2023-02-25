import React from 'react';
import { connect } from 'react-redux';
import { ILanguageTranslation, Language } from '../models/languages.model';
import { AppState } from '../models/states.model';
import { useAppSelector } from '../state/Hooks';

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
	const language: string = useAppSelector((state: AppState) => state.language);

	return (key: string) => translateKey(language, key);
};

const languages: ILanguageTranslation = {
	[Language.ENGLISH]: {
		"SIGN_IN": "Sign In",
		"YOUR_TEAM_NUMBER": "Your team number",
		"TEAM_NUMBER": "Team number",
		"EVENT_CODE": "Event code",
		"SECRET_CODE": "Secret code",
		"LOADING": "Loading...", // TODO: translate
		"MATCH": "Match",
		"MATCHES": "Matches",
		"TEAM": "Team",
		"TEAMS": "Teams",
		"STATS": "Stats",
		"DATA": "Data",
		"LANGUAGE": "Language",
		"LOGOUT": "Logout",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "Select a match to view more details",
		"STAT_TABLE": "Stat table",
		"MEAN_LIST": "Mean list",
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
		"CHARGE_STATION_2023": "Charge Station",
		"GRID_2023": "Grid",
		"BLUE_GRID_2023": "Grid (blue)",
		"RED_GRID_2023": "Grid (red)",
		"NORMALIZED_GRID_2023": "Normalized Grid"
	},
	[Language.SPANISH]: {
		"SIGN_IN": "Iniciar sesión",
		"YOUR_TEAM_NUMBER": "Tu numero de equipo",
		"TEAM_NUMBER": "Numero de equipo",
		"EVENT_CODE": "Código del evento",
		"SECRET_CODE": "Código secreto",
		"LOADING": "Loading...", // TODO: translate
		"MATCH": "Partido",
		"MATCHES": "Partidos",
		"TEAM": "Equipo",
		"TEAMS": "Equipos",
		"STATS": "Estadísticas",
		"DATA": "Datos",
		"LANGUAGE": "Lengua",
		"LOGOUT": "Cerrar sesión",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "Seleccione un partido para ver más detalles",
		"STAT_TABLE": "Tabla de estadisticas",
		"MEAN_LIST": "Lista media",
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
		"TEAM_NUMBER": "Numéro d'équipe",
		"EVENT_CODE": "Code de l'événement",
		"SECRET_CODE": "Code secret",
		"LOADING": "Loading...", // TODO: translate
		"MATCH": "Match",
		"MATCHES": "Matchs",
		"TEAM": "Équipe",
		"TEAMS": "Équipes",
		"STATS": "Statistiques",
		"DATA": "Les données",
		"LANGUAGE": "Langue",
		"LOGOUT": "Se déconnecter",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "Sélectionnez une match pour afficher plus de détails",
		"STAT_TABLE": "Tableau statistique",
		"MEAN_LIST": "Liste moyenne ",
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
	},
	[Language.TURKISH]: {
		"SIGN_IN": "Kayıt Olmak",
		"YOUR_TEAM_NUMBER": "Takım numaranız",
		"TEAM_NUMBER": "Takım numarası",
		"EVENT_CODE": "Etkinlik kodu",
		"SECRET_CODE": "Gizli kod",
		"LOADING": "Loading...", // TODO: translate
		"MATCH": "Maç",
		"MATCHES": "Maçlar",
		"TEAM": "Takım",
		"TEAMS": "Takımlar",
		"STATS": "Istatistikler",
		"DATA": "Veri",
		"LANGUAGE": "Dilim",
		"LOGOUT": "Çıkış Yap",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "Daha fazla ayrıntı görmek için bir eşleşme seçin",
		"STAT_TABLE": "Istatistik tablosu",
		"MEAN_LIST": "Ortalama liste",
		"MEAN": "Ortalama",
		"MEDIAN": "Medyan",
		"MODE": "Mod",
		"SCORES": "Puanı",
		"SELECT_TEAM_VIEW_MORE_DETAILS": "Daha fazla ayrıntı görmek için bir ekip seçin",
		"VALUE": "Değer",
		"SELECT_STAT_VIEW_MORE_DETAILS": "Derinlemesine analizi görüntülemek için bir istatistik seçin",
		"ACCOUNT": "Hesap",
		"DOWNLOAD_DATA": "Verileri indir",
		"DOWNLOAD_DATA_AS_CSV": "Verileri CSV dosyası olarak indirin",
		"CHANGE_LANGUAGE": "Dili değiştir",
		"EXCLUDE_FROM_STATS": "Maç verilerini takım istatistiklerinden hariç tut",
		"INCLUDE_IN_STATS": "Takım istatistiklerine maç verilerini dahil et",
		"HIDDEN": "Gizlenmiş",
		"AUTO": "Otonom",
		"TELEOP": "Uzaktan Kontrol",
		"HIGH_GOAL_2022": "Üst Aktarma Merkez",
		"LOW_GOAL_2022": "Alt Aktarma Merkezi̇",
		"MISS_GOAL_2022": "Kaçırılan Gol",
		"MOBILITY_2022": "Taksi̇",
		"CLIMB_2022": "Hangar",
	},
	[Language.HINDI]: {
		"SIGN_IN": "साइन इन करें",
		"YOUR_TEAM_NUMBER": "आपकी टीम नंबर",
		"TEAM_NUMBER": "टीम नंबर",
		"EVENT_CODE": "घटना कोड",
		"SECRET_CODE": "गुप्त संकेत",
		"LOADING": "Loading...", // TODO: translate
		"MATCH": "खेल",
		"MATCHES": "माचिस",
		"TEAM": "टीम",
		"TEAMS": "टीमों",
		"STATS": "आंकड़े",
		"DATA": "डेटा",
		"LANGUAGE": "भाषा",
		"LOGOUT": "लॉग आउट",
		"SELECT_MATCH_VIEW_MORE_DETAILS": "अधिक विवरण देखने के लिए एक मैच का चयन करें",
		"STAT_TABLE": "सांख्यिकी तालिका",
		"MEAN_LIST": "औसत सूची",
		"MEAN": "माध्य",
		"MEDIAN": "माध्यिका",
		"MODE": "मोड",
		"SCORES": "स्कोर",
		"SELECT_TEAM_VIEW_MORE_DETAILS": "अधिक विवरण देखने के लिए एक टीम का चयन करें",
		"VALUE": "मूल्य",
		"SELECT_STAT_VIEW_MORE_DETAILS": "गहन विश्लेषण देखने के लिए एक आँकड़ा चुनें",
		"ACCOUNT": "हेतु",
		"DOWNLOAD_DATA": "डेटा डाउनलोड करें",
		"DOWNLOAD_DATA_AS_CSV": "डेटा को CSV फ़ाइल के रूप में डाउनलोड करें",
		"CHANGE_LANGUAGE": "भाषा बदलें",
		"EXCLUDE_FROM_STATS": "टीम के आँकड़ों से मिलान डेटा बहिष्कृत करें",
		"INCLUDE_IN_STATS": "टीम के आंकड़ों में मिलान डेटा शामिल करें",
		"HIDDEN": "छुपे हुए",
		"AUTO": "स्वायत्तशासी",
		"TELEOP": "मानव नियंत्रण",
		"HIGH_GOAL_2022": "उच्च बंदरगाह",
		"LOW_GOAL_2022": "कम बंदरगाह",
		"MISS_GOAL_2022": "छूटी हुई गेंद",
		"MOBILITY_2022": "टैक्सी",
		"CLIMB_2022": "हैंगर",
	}
};
