import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import css from '@eslint/css';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { rules: { semi: ['error', 'always'] } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
    arrowParens: true,
    quoteProps: 'as-needed',
    commaDangle: 'always-multiline',
  }),
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
]);
