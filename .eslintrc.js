module.exports = {
  root: true, // Important for monorepos
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './services/*/tsconfig.json', './packages/*/tsconfig.json'], // Adjust glob patterns
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    // Add other global rules
  },
  ignorePatterns: ['node_modules', 'dist', 'coverage', '*.js', '*.json', '!.*.js', '!.*.json'], // Fine-tune as needed
};
