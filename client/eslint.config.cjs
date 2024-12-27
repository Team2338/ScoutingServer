const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
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
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
			/* These are probably controlled by Prettier now */
			indent: [ 'error', 'tab', { SwitchCase: 1 }],
			'linebreak-style': [ 'error', 'unix' ],
			quotes: [ 'error', 'single' ],
			semi: [ 'error', 'always' ],
			'no-case-declarations': [ 'warn' ],

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
		},
  },
];
