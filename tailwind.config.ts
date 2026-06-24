import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa",
          300: "#fdba74", 400: "#fb923c", 500: "#f97316",
          600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0/0.08),0 1px 2px -1px rgb(0 0 0/0.06)",
        "card-hover": "0 10px 30px -5px rgb(0 0 0/0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
