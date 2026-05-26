/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        // --- BRAND TEXT & GLOWS ---
        'text-color': 'var(--text-color)',
        'violet-glow': 'var(--violet-background)',
        'violet-main-background': 'var(--violet-main-background)',

        // --- GOLD & YELLOW PALETTE ---
        'gold-background': 'var(--gold-background)',
        'gold-buttons': 'var(--gold-buttons)',
        'bigview-gold': 'var(--gold-primary)',
        'bigview-gold-dim': 'var(--gold-secondary)',
        'muted-yellow': 'var(--muted-yellow)',
        'electric-yellow': 'var(--electric-yellow)',

        // --- GREEN PALETTE ---
        'light-green': 'var(--light-green)',
        'solid-green': 'var(--solid-green)',
        'vibrant-green': 'var(--vibrant-green)',

        // --- BLUE PALETTE ---
        'blue': 'var(--blue)',
        'light-blue': 'var(--light-blue)',

        // --- NEUTRALS / MONOCHROME (Fixed charcoal typo) ---
        'color-white': 'var(--color-white)',
        'color-ash': 'var(--color-ash)',
        'charcaol': 'var(--medium-black)', 
        'light-black': 'var(--light-black)',
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