module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:tailwindcss/recommended',
	],
	ignorePatterns: [
		'dist',
		'.prettierrc',
		'.eslintrc.cjs',
		'node_modules',
		'build',
		'vite.config.ts',
		'tailwind.config.ts',
		'postcss.config.js',
		'src/vite-env.d.ts',
		'src/components/plate-ui',
		'src/components/editor.tsx',
		'src/components/icons.tsx',
		'src/editor-styles/tailwind.config.js',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['react', 'react-refresh', 'react-hooks', '@typescript-eslint'],
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
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'tailwindcss/no-custom-classname': 'off',
		'tailwindcss/classnames-order': 'off', // this option for now seems to be incompatible with the prettier tailwindcss plugin
	},

	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.app.json'],
		tsconfigRootDir: __dirname,
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
};
