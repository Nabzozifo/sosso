/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kente-gold': '#FFD700',
        'sunset-orange': '#FF8C00',
        'baobab-green': '#228B22',
        'forest-green': '#006400',
        'bogolan-brown': '#8B4513',
        'adinkra-gold': '#DAA520',
        'sahara-sand': '#F4A460',
      },
      fontFamily: {
        'gilroy': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}