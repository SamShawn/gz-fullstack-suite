import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier, // 放在最后，关闭与 Prettier 冲突的 ESLint 规则
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // 警告而不是报错，方便快速开发
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 忽略以 _ 开头的未使用参数
    },
  },
)
