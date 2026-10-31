import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#0a0a0c",
        foreground: "#ededed",

        aperture: {
          dark: "#14151a",
          orange: "#f2994a",
          blue: "#56ccf2",
          yellow: "#f2c94c",
          gray: "#2d2e37",
        },
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
        serif: ["var(--font-playfair)", "Playfair Display", "Newsreader", "Georgia", "serif"],
        oswald: ["var(--font-oswald)", "Oswald", "sans-serif"],
        raleway: ["var(--font-raleway)", "Raleway", "sans-serif"],
      },

      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scanline: "scanline 8s linear infinite",
      },

      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },

  plugins: [tailwindcssAnimate],
};

export default config;