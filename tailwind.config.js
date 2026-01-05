/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        moss: "#4B5320",
        mossLight: "#8A9A5B",
        mossDark: "#2C3220",
        // background
        blushPeach: "#F4D4C1",
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
