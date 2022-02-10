
class TranslateService {

	private mapping = languages.english;

	setLanguage = async (language: string): Promise<void> => {
		this.mapping = languages[language];
	}

	public translate = (key: string): string => {
		if (this.mapping.hasOwnProperty(key)) {
			return this.mapping[key];
		}

		return key;
	}

}

const languages = {
	english: {
		'HELLO_WORLD': 'Hello world',
		'MATCH': 'Match',
		'TEAM': 'Team',
		'DOWNLOAD_DATA': 'Download Data'
	}
}

export default new TranslateService();
