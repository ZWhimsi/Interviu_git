/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // toggles dark mode via a "dark" class on <html>
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Your brand colors, e.g.:
        brandBlue: "#0066CC",
        brandPurple: "#A645FF",
        brandPink: "#E74E97",
        brandOrange: "#E86E26",
        brandCyan: "#0CEBEB",
        brandGreen: "#A8E825",
      },
    },
  },
  plugins: [],
};
