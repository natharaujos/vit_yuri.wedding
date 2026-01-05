/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nova paleta personalizada
        wedding: {
          primary: "#B24C60",     // Cor principal (rosa intenso)
          secondary: "#CE6375",   // Cor secundária (rosa médio)
          accent: "#AF5C78",      // Cor de destaque
          light: "#BF7078",       // Cor clara
          lighter: "#E8A5AC",     // Versão mais clara para backgrounds
          50: "#F9E8EB",          // Muito claro
          100: "#F3D1D6",         // Muito claro
          200: "#E8A5AC",         // Claro
          300: "#BF7078",         // Médio claro
          400: "#AF5C78",         // Médio
          500: "#B24C60",         // Base
          600: "#CE6375",         // Intenso
          700: "#A03D52",         // Escuro
          800: "#7C2E3E",         // Muito escuro
        },
        // Cores antigas para compatibilidade (remover depois)
        roseLight: "#FFB6C1",
        roseMedium: "#FF69B4",
        roseDark: "#C71585",
        roseBlush: "#FFC0CB",
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
