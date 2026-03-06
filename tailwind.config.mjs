/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#1a73e8",
          hover: "#1557b0",
          light: "#e8f0fe",
          50: "#f0f7ff",
        },
        goog: {
          gray: {
            50: "#f8f9fa",
            100: "#f1f3f4",
            200: "#e8eaed",
            300: "#dadce0",
            400: "#bdc1c6",
            500: "#9aa0a6",
            600: "#80868b",
            700: "#5f6368",
            800: "#3c4043",
            900: "#202124",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
