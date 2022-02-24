
class TranslateService {

	private mapping = languages.english;

	getSelectedLanguage = () => 'english';

	setLanguage = (language: string): void => {
		this.mapping = languages[language];
	}

	public translate = (key: string): string => {
		if (this.mapping.hasOwnProperty(key)) {
			return this.mapping[key];
		}

		return key;
	};

}

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

export default new TranslateService();
