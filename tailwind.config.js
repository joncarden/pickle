/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a90e2',
        secondary: '#f5a623',
        success: '#7ed321',
        danger: '#d0021b',
        light: '#f8f9fa',
        dark: '#333333',
        gray: {
          DEFAULT: '#9b9b9b',
        },
        'activity-potty': '#16A085',
        'activity-meal': '#2980B9',
        'activity-rest': '#9B59B6',
        'activity-play': '#E74C3C',
        'activity-training': '#F39C12',
      },
    },
  },
  plugins: [],
} 