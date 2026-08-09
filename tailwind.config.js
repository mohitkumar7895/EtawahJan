/** @type {import('tailwindcss').Config} */
module.exports = {
  /** Apply `dark` class on a subtree only — admin uses `.admin-theme-root` (see AdminLayout). */
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './admin/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: 'var(--theme-primary-50, #eff6ff)',
          100: 'var(--theme-primary-100, #dbeafe)',
          200: 'var(--theme-primary-200, #bfdbfe)',
          300: 'var(--theme-primary-300, #93c5fd)',
          400: 'var(--theme-primary-400, #60a5fa)',
          500: 'var(--theme-primary-500, #3b82f6)',
          600: 'var(--theme-primary-600, #2563eb)',
          700: 'var(--theme-primary-700, #1d4ed8)',
          800: 'var(--theme-primary-800, #1e40af)',
          900: 'var(--theme-primary-900, #1e3a8a)',
          950: 'var(--theme-primary-950, #172554)',
        },
      },
    },
  },
  plugins: [],
}


















