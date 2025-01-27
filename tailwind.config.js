module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Agrega Poppins como fuente predeterminada
      },
      colors: {
      "violeta": "#A278D7"
      },
  },
  plugins: [],
}
}