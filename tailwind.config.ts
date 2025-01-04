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
          "20%": { transform: "translateX(0)" }, // Pause on the first video
          "33.33%": { transform: "translateX(-100vw)" },
          "53.33%": { transform: "translateX(-100vw)" }, // Pause on the second video
          "66.66%": { transform: "translateX(-200vw)" },
          "86.66%": { transform: "translateX(-200vw)" }, // Pause on the third video
          "100%": { transform: "translateX(-300vw)" },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '80%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        slide: "slide 23s infinite linear",
        pop: 'pop 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-in',
      },
      screens: {
        'sm': '319px'
      }
    },
  },
  plugins: [],
} satisfies Config;


