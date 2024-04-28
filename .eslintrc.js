/** @type {import('eslint').Linter.Config} */
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'prettier',
    ],
    parserOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
    },
    root: true,
    env: {
      es2020: true,
      node: true,
    },
    ignorePatterns: ['node_modules','dist'],
    rules: {
      "no-unused-vars": "off",
      "@eslint/no-unused-vars": ["error"],
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': 'warn',
    },
  }
  