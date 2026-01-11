/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主题色
        primary: {
          DEFAULT: '#5b7fff',
          light: '#8ca4ff',
          dark: '#3d5bd6',
        },
        secondary: '#ff6b6b',
        success: '#52c41a',
        warning: '#faad14',
        error: '#ff4d4f',
        // 文字颜色
        text: {
          primary: '#1a1a2e',
          secondary: '#666666',
          light: '#999999',
          white: '#ffffff',
        },
        // 背景色
        bg: {
          primary: '#f5f7fa',
          white: '#ffffff',
          card: '#ffffff',
        },
        // 边框和分割线
        border: '#e8e8e8',
        divider: '#f0f0f0',
      },
      spacing: {
        // rpx 单位映射 (1rpx ≈ 0.5px on standard screens)
        'xs': '4px',    // 8rpx
        'sm': '8px',    // 16rpx
        'md': '12px',   // 24rpx
        'lg': '16px',   // 32rpx
        'xl': '24px',   // 48rpx
      },
      fontSize: {
        'xs': ['11px', '1.5'],   // 22rpx
        'sm': ['12px', '1.5'],   // 24rpx
        'base': ['14px', '1.5'], // 28rpx
        'lg': ['16px', '1.5'],   // 32rpx
        'xl': ['18px', '1.5'],   // 36rpx
        '2xl': ['22px', '1.5'],  // 44rpx
        '3xl': ['28px', '1.5'],  // 56rpx
      },
      borderRadius: {
        'sm': '4px',    // 8rpx
        'md': '8px',    // 16rpx
        'lg': '12px',   // 24rpx
        'full': '500px', // 999rpx
      },
      boxShadow: {
        'sm': '0 1px 4px rgba(0, 0, 0, 0.08)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'lg': '0 4px 16px rgba(0, 0, 0, 0.16)',
        'primary': '0 4px 12px rgba(91, 127, 255, 0.4)',
      },
    },
  },
  plugins: [],
  // uni-app 兼容配置
  corePlugins: {
    preflight: false, // 禁用 Tailwind 的基础样式重置,避免与 uni-app 冲突
  },
}
