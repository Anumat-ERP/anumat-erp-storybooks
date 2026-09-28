import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import base from './base.js';

/** React packages: base + hooks rules + Storybook story rules. */
export default [
  ...base,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  ...storybook.configs['flat/recommended'],
];
