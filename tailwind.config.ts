import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'safety-orange': '#FF4400',
        'manilla': '#F4F4F0',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Courier Prime', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.05em',
      },
      boxShadow: {
        'hard': '5px 5px 0px 0px rgba(0,0,0,1)',
        'hard-hover': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
export default config
