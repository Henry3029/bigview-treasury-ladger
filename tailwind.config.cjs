/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This connects 'font-inter' class to the Google Font variable
        'inter': ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        'gold-background': 'var(--gold-background)',
        'gold-buttons': 'var(--gold-buttons)',
        'violet-main-background': 'var(--violet-main-background)',
        
        // text colors
        'text-color': 'var(--text-color)',
        'violet-glow': 'var(--violet-background)',
      },
      
      backgroundImage: {
      'violet-background': 'linear-gradient(to bottom right, var(--violet-background))',
    },
    
      borderRadius: {
        'bigview': '1rem',
      }
    },
  },
  plugins: [],
}