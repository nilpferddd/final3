/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'solana-green': '#14F195',
        'solana-purple': '#9945FF',
        'dark-blue': '#1E2D3D',
        'light-blue': '#00C2FF',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
