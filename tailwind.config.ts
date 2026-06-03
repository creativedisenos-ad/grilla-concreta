import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A2452',
          50: '#EEF2F9',
          100: '#D5DEEE',
          200: '#A8B9D9',
          300: '#7A93C3',
          400: '#4D6EAE',
          500: '#1F4998',
          600: '#1A3B7C',
          700: '#0A2452',
          800: '#061838',
          900: '#030D1F',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
