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
        'light-green': 'var(--light-green)',
  'solid-green': 'var(--solid-green)',
'vibrant-green': 'var(--vibrant-green)',
  'color-white': 'var(--color-white)',
 'muted-yellow': 'var(--muted-yellow)',
  'electric-yellow': 'var(--electric-yellow)',
  'color-ash': 'var(--color-ash)',
  'blue': 'var(--blue)',
  'light': 'var(--light-blue)',
        
        
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