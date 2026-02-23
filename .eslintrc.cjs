module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: ['eslint:recommended'],
  ignorePatterns: ['dist', 'node_modules', 'coverage', '*.cjs', 'backend/dist'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};
