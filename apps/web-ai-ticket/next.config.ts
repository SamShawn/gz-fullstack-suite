import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 关闭 Next 16 的激进特性，回归稳定（解决 AntdRegistry 预渲染报错）
  cacheComponents: false,
  partialPrefetching: false,
  output: 'standalone',
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
