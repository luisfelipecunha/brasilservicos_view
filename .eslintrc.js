module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/triple-slash-reference': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ ignoreRestSiblings: true },
		],
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-await-in-loop': 'error',
		'no-extra-parens': 'off',
		'no-irregular-whitespace': 'error',
		'no-invalid-regexp': 'error',
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'none', // 'none' or 'semi' or 'comma'
					requireLast: true,
				},
				singleline: {
					delimiter: 'semi', // 'semi' or 'comma'
					requireLast: false,
				},
			},
		],
		'comma-dangle': ['error', 'always-multiline'],
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j|t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)',
			],
		},
		{
			files: ['shims-tsx.d.ts'],
			rules: {
				'@typescript-eslint/no-empty-interface': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
			},
		},
		{
			files: ['vue.config.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
	],
}
