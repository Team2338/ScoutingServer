
export enum Language {
	ENGLISH = 'english',
	SPANISH = 'spanish',
	FRENCH = 'french',
	TURKISH = 'turkish'
}

export type ILanguageTranslation = {
	[language in Language]: {
		[key: string]: string;
	}
};
