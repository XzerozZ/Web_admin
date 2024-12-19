import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2A4296",
        secondary: "#FCE49E",
        neutral: "#FCFCFC",
        neutral2: "#DBDFEC",
        normalText: "#070F2D",
        accent: "#F68D2B",
        secondaryAccent: "#FFB36C",
        primary2: "#6780D6",
        secondary2: "#FFECB6",
        secondary3: "#FFF4D7",
        label: "#979797",
        unselectMenu: "#B0B0B0",
        lightBgChart: "#C9C9C9",
        unselectInput: "#DBDFEC",
        ok: "#83FF83",
        err: "#FF5449",
        banner: "#C8D4FF",
      },
    },
  },
  plugins: [],
} satisfies Config;
