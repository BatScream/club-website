/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // App Router / pages / components (adjust "src" if your code is at project root)
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",

    // If you keep some files outside src:
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Optional: include other locations you use (stories, utils that render JSX, etc.)
  ],
  darkMode: "class", // or "media" if you prefer system-level dark mode
  theme: {
    extend: {
      // small example brand color — replace with your palette
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#2563eb",
          700: "#1d4ed8",
        },
      },
      // tweak container settings if you like
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "3rem",
        },
      },
    },
  },
  plugins: [
    // nice default styling for form elements (inputs/selects/radios)
    require("@tailwindcss/forms"),
    // optionally add typography or aspect-ratio if you need them:
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};
