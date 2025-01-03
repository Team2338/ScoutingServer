import nx from '@nx/eslint-plugin';

export default [
	...nx.configs['flat/base'],
	...nx.configs['flat/typescript'],
	...nx.configs['flat/javascript'],
	{
		ignores: ['**/dist']
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
					depConstraints: [
						{
							sourceTag: '*',
							onlyDependOnLibsWithTags: ['*']
						}
					]
				}
			]
		}
	},
	{
		files: [
			'**/*.ts',
			'**/*.tsx',
			'**/*.js',
			'**/*.jsx',
			'**/*.cjs',
			'**/*.mjs'
		],
		// Override or add rules here
		rules: {
			/* These are probably controlled by Prettier now */
			indent: ['error', 'tab', { SwitchCase: 1 }],
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'no-case-declarations': ['warn'],

			/* TypeScript rules */
			'@typescript-eslint/array-type': [
				'error',
				{ default: 'array' }
			],
			'@typescript-eslint/consistent-generic-constructors': [
				'warn',
				'type-annotation' // Prefer putting generics on the left side
			],
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{
					assertionStyle: 'as',
					objectLiteralTypeAssertions: 'allow'
				}
			],
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'no-array-constructor': 'off', // Disable base rule - let TS plugin handle it
			'@typescript-eslint/no-array-constructor': 'error'
		}
	},
	{
		files: [
			'**/*.ts',
			'**/*.tsx'
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-exports': 'warn', // TODO: set this to error when fixed
			'@typescript-eslint/consistent-type-imports': 'warn', // TODO: set this to error when fixed
		}
	}
];
