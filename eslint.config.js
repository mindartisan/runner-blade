// eslint.config.js - 最小化配置
const eslintConfig = [
  // 忽略文件和目录（必须在其他配置之前）
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
    ],
  },
  // 应用配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // 基础规则
      'no-console': 'warn',
      'no-unused-vars': 'off',
    },
  },
];

module.exports = eslintConfig;
