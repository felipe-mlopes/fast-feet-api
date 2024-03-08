import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "indigo-blue": "#4C33CC",
        "orange-light": "#FFC042",
        "lilac-smooth": "#D4CCFF",
        "purple-dark": "#4C4766",
        "gray-light": "#F7F5FA",
        "bluish-gray": "#DAD7E0",
      }
    },
  },
  plugins: [],
};
export default config;
