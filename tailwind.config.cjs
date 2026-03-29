/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This connects your components to the Inter font we imported in CSS
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Cleaned up the "Bank" colors to match the Bigview brand
        bigviewGreen: "#00D094",
        bigviewBlue: "#2563EB",
      },
      borderRadius: {
        // We can define custom "un-bubble" corners here if you want
        'bigview': '1.5rem', // A clean 24px radius
      }
    },
  },
  plugins: [],
}