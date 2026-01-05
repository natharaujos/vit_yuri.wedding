/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        roseLight: "#FFB6C1",
        roseMedium: "#FF69B4",
        roseDark: "#C71585",
        roseBlush: "#FFC0CB",
        // background
        rosePeach: "#FFE4E1",
      },
      spacing: {
        128: "32rem", // e.g., class="w-128"
        144: "36rem",
      },
      fontSize: {
        xxs: "0.625rem", // class="text-xxs"
      },
    },
  },
  plugins: [],
};
