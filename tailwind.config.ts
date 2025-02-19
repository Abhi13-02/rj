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
          "0%, 30%": { transform: "translateX(0)" }, 
          "37%, 60%": { transform: "translateX(-100vw)" }, 
          "67%, 93%": { transform: "translateX(-200vw)" }, 
          "100%": { transform: "translateX(-300vw)" },
        },
        pop: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "80%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slide: "slide 15s infinite ease-in-out",
        pop: "pop 0.5s ease-out",
        "fade-in": "fadeIn 0.8s ease-in",
      },
      screens: {
        'sm': '319px'
      }
    },
  },
  plugins: [],
} satisfies Config;
