import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './sidepanel.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orbit: {
          50: '#eef6ff',
          100: '#d9ebff',
          500: '#3b82f6',
          600: '#2563eb',
          950: '#0f172a'
        }
      },
      boxShadow: {
        panel: '0 18px 60px rgba(15, 23, 42, 0.16)'
      }
    }
  },
  plugins: []
} satisfies Config;
