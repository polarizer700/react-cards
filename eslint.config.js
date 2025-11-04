// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    typescript: {
      overrides: {
        'ts/consistent-type-definitions': 'off',
      },
    },
    javascript: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
      jsx: true,
      overrides: {
        'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      },
    },
    rules: {
      'style/jsx-curly-brace-presence': 'off',
      'no-prototype-builtins': 'off',
      'ts/no-use-before-define': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'antfu/top-level-function': 'off',
      'no-console': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },
  {
    ignores: [
      '**/src/routeTree.gen.ts', // Этот файл, вероятно, отсутствует, но не мешает
      'openapi.yaml',
      'openapi_prod.yaml',
      'openapi_prod_new.yaml',
      'bff-swagger.yaml',
      'feature.yaml',
      'deploy/*',
    ],
  },
);
