
export enum Language {
	ENGLISH = 'english',
	SPANISH = 'spanish',
	FRENCH = 'french',
	TURKISH = 'turkish',
	HINDI = 'hindi'
}

export type ILanguageTranslation = {
	[language in Language]: {
		[key: string]: string;
	}
};
