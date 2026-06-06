import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          darkest: "#030712",
          dark: "#090d1a",
          panel: "rgba(15, 23, 42, 0.65)",
        },
        primary: {
          cyan: "#00f0ff",
        },
        accent: {
          blue: "#3b82f6",
        },
        brand: {
          violet: "#8b5cf6",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(0, 240, 255, 0.15)" },
          "50%": { boxShadow: "0 0 25px rgba(0, 240, 255, 0.3)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
