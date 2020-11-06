const { join } = require('path');

module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'rxjs'],
	parserOptions: {
		ecmaVersion: 2020,
		project: join(__dirname, './tsconfig.e2e.json'),
		sourceType: 'module'
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint'
	],
	rules: {
		'@typescript-eslint/ban-types': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
		'no-mixed-spaces-and-tabs': 'error'
	}
};
