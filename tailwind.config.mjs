/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ai-blue": "#1E3A8A",
        "ai-purple": "#7C3AED",
      },
      animation: {
        pulseSlow: "pulse 2s linear infinite",
      },
    },
  },
  plugins: [],
};
