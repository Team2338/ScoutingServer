
export enum Language {
	ENGLISH = 'english',
	SPANISH = 'spanish',
	FRENCH = 'french'
}

export type ILanguageTranslation = {
	[language in Language]: {
		[key: string]: string;
	}
};
