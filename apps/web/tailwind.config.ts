import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E', // Trust Teal
          dark: '#115E59',
          light: '#14B8A6',
        },
        secondary: {
          DEFAULT: '#0369A1', // Professional Blue
          light: '#38BDF8',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        slate: {
          950: '#020617',
          900: '#0F172A',
          800: '#1E293B',
        },
      },
    },
  },
  plugins: [],
};

export default config;

