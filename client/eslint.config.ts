import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import stylistic from '@stylistic/eslint-plugin';
import css from '@eslint/css';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    // Ignorované složky
    globalIgnores(['dist', 'node_modules']),

    // JS / TS / React
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.node },
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react: pluginReact,
            stylistic,
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            pluginReact.configs.flat.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            stylistic.configs['recommended-flat'],
            stylistic.configs.customize({
                indent: 4,
                quotes: 'single',
                semi: true,
                jsx: true,
                arrowParens: true,
                quoteProps: 'as-needed',
                commaDangle: 'always-multiline',
            }),
        ],
        rules: {
            'react/react-in-jsx-scope': 'off', // React 17+ transform, není potřeba importovat React
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // CSS lint
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended'],
    },
]);
