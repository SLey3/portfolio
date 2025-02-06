import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react_hooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';
import tailwindcss from 'eslint-plugin-tailwindcss';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	eslintConfigPrettier,
	js.configs.recommended,
	tseslint.configs.recommended,
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	{
		ignores: [
			'dist/*',
			'.prettierrc',
			'eslint.config.js',
			'node_modules/*',
			'build/*',
			'vite.config.ts',
			'tailwind.config.ts',
			'postcss.config.js',
			'src/vite-env.d.ts',
		],
	},
	{
		plugins: {
			'react-hooks': react_hooks,
			'react-refresh': reactRefresh,
			tailwindcss: tailwindcss,
		},
		rules: {
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'react/jsx-sort-props': [
				'warn',
				{
					ignoreCase: true,
					multiline: 'last',
				},
			],
			'react/jsx-no-leaked-render': 'error',
			'react/no-array-index-key': 'error',
			eqeqeq: ['error', 'always'],
			'react/prop-types': 'off',
			'react/display-name': 'off',
			'react/no-unknown-property': 'off',
			'typescript-eslint/no-unsafe-member-access': 'off',
			'typescript-eslint/no-unsafe-argument': 'off',
			'typescript-eslint/no-unsafe-call': 'off',
			'typescript-eslint/no-unsafe-assignment': 'off',
			'tailwindcss/no-custom-classname': 'off',
			'tailwindcss/classnames-order': 'off', // this option for now seems to be incompatible with the prettier tailwindcss plugin
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
			tailwindcss: {
				callees: ['twMerge', 'createTheme'],
				classRegex: '^(class(Name)|theme)?$',
			},
		},
	},
);
