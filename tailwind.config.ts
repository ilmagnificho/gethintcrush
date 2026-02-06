import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        blush: '#f472b6',
        haze: '#f8fafc'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
