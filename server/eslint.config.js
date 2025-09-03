// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
         },
    },
    rules: {
      semi: ['error', 'always'],
      'no-console': 'warn',
      'no-undef': 'off',
        },
  },
];