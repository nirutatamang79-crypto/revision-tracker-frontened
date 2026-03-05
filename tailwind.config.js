/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0d0c0b', paper: '#161411', card: '#1e1b17',
        border: '#2d2820', muted: '#6b6056', warm: '#ede8e0',
        amber: '#e8a234', ember: '#d4622a', sage: '#5a9e72',
      },
    },
  },
  plugins: [],
};
