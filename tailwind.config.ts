import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  // Optimize CSS generation and compilation for faster build times.
  mode: "jit",
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      sans: ["'Nunito'", "Monospace", "sans-serif"],
      serif: ["'Playfair Display'", "serif"],
    },

    extend: {
      colors: {
        primary: {
          light: "#142d4c",
          dark: "#f4eeff",
        },
        background: {
          light: "#ececec",
          dark: "#1A202C",
        },
        text: {
          light: "#142d4c",
          dark: "#F9FAFB",
        },
        accent: {
          light: "#9fd3c7",
          dark: "#ff6f5e",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
