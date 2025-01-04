
export enum Language {
	ENGLISH = 'english',
	SPANISH = 'spanish',
	FRENCH = 'french',
	TURKISH = 'turkish',
	CZECH = 'czech'
}

export interface LanguageDescriptor {
	key: Language;
	code: string;
	localName: string;
	englishName: string;
}

type ILanguageInfo = {
	[key in Language]: LanguageDescriptor;
};

export const LanguageInfo: ILanguageInfo = {
	[Language.ENGLISH]: {
		key: Language.ENGLISH,
		code: 'en',
		localName: 'English',
		englishName: 'English'
	},
	[Language.SPANISH]: {
		key: Language.SPANISH,
		code: 'es',
		localName: 'Español',
		englishName: 'Spanish'
	},
	[Language.FRENCH]: {
		key: Language.FRENCH,
		code: 'fr',
		localName: 'Français',
		englishName: 'French'
	},
	[Language.TURKISH]: {
		key: Language.TURKISH,
		code: 'tr',
		localName: 'Türkçe',
		englishName: 'Turkish'
	},
	[Language.CZECH]: {
		key: Language.CZECH,
		code: 'cz',
		localName: 'Čeština',
		englishName: 'Czech'
	}
};

export type ILanguageTranslation = {
	[language in Language]: {
		[key: string]: string;
	}
};
