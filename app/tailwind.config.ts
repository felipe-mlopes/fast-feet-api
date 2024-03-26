import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-inter)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "card": "0px 8px 24px 0px rgba(21, 6, 51, 0.08)"
      },
      colors: {
        "indigo-blue": "#4C33CC",
        "orange-light": "#FFC042",
        "lilac-smooth": "#D4CCFF",
        "purple-dark": "#4C4766",
        "gray-light": "#F7F5FA",
        "bluish-gray": "#DAD7E0",
        "lavender-gray": "#6F6C80",
        "yellow-slow": "#FFF1D6",
        "ligth-slate-gray": "#BEBCCC",
        "spring-green": "#00DA6D"
      }
    },
  },
  plugins: [],
};
export default config;
