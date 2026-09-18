import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(__dirname, 'apps/**/*.{html,js,ts,jsx,tsx}').replace(/\\/g, '/'),
    path.resolve(__dirname, 'packages/**/*.{html,js,ts,jsx,tsx}').replace(/\\/g, '/'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#00F0FF',
          500: '#00D2FF',
        },
      },
    },
  },
  plugins: [],
};
