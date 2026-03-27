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
    extend: {},
  },
  plugins: [],
}


















