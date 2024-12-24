import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(0)" },
          "16.66%": { transform: "translateX(0)" }, // Pause on the first image
          "33.33%": { transform: "translateX(-100vw)" },
          "50%": { transform: "translateX(-100vw)" }, // Pause on the second image
          "66.66%": { transform: "translateX(-200vw)" },
          "83.33%": { transform: "translateX(-200vw)" }, // Pause on the third image
          "100%": { transform: "translateX(-300vw)" }, // Continue
        },
      },
      animation: {
        slide: "slide 14s infinite linear"
      }
    },
  },
  plugins: [],
} satisfies Config;
