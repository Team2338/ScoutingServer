
type Translator = (key: string) => string;

export const useTranslator = (): Translator => {
	return (key: string) => {
		if (Object.hasOwn(translations, key)) {
			return translations[key];
		}

		return key;
	};
};

const translations: Record<string, string> = {
	'INSPECTIONS': 'Inspections',
	'MATCHES': 'Matches',
	'FAILED_TO_LOAD_EVENTS': 'Failed to load events',
	'RETRY': 'Retry'
};