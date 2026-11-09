import globals from 'globals';

export default {
  languageOptions: {
    ecmaVersion: 9,
    globals: {
      ...globals.browser,
      ...globals.commonjs,
      ...globals.es6,
    },
  },
  ignores: [
    'dist/',
  ],
  rules: {
    semi: 2,
    strict: [2, 'global',],
    'comma-dangle': [
      2,
      {
        arrays: 'always',
        objects: 'always',
        imports: 'always',
        exports: 'always',
        functions: 'never',
      },
    ],
    quotes: [2, 'single', {allowTemplateLiterals: true,},],
    'new-cap': 0,
    'camelcase': 0,
    'keyword-spacing': ['error', {after: true,},],
    'max-len': ['error', 100,],
  },
};
