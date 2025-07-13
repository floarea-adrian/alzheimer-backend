/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // asigură-te că include toate fișierele frontend
  ],
  theme: {
    extend: {
  fontFamily: {
    sans: ["Inter", "sans-serif"],
  },
  colors: {
    darkbg: "#fefcfb",
    darkmid: "#f8f4f0",
    accent: "#22c55e",
    glass: "rgba(255, 255, 255, 0.1)",
  },
  animation: {
    gradient: "gradient 8s ease infinite",
  },
  keyframes: {
    gradient: {
      "0%, 100%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
    },
  },
},

  },
  plugins: [],
};
