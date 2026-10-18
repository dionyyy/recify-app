/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#FAFBFC",
          dark: "#0F0F1A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1A2E",
        },
        primary: {
          DEFAULT: "#FF6B6B",
          light: "#FF8A80",
          dark: "#E85555",
          50: "#FFF0F0",
          100: "#FFD6D6",
          200: "#FFB3B3",
          300: "#FF8A8A",
          400: "#FF6B6B",
          500: "#E85555",
          600: "#CC4444",
          700: "#993333",
          800: "#662222",
          900: "#331111",
        },
        secondary: {
          DEFAULT: "#4ECDC4",
          light: "#64FFDA",
          dark: "#3DB8B0",
          50: "#EDFFFE",
          100: "#D5FFF9",
          200: "#AEFFF4",
          300: "#7BFFE9",
          400: "#4ECDC4",
          500: "#3DB8B0",
          600: "#2D9B94",
          700: "#1F7A74",
          800: "#155A55",
          900: "#0A3935",
        },
        navy: {
          DEFAULT: "#1A1A2E",
          50: "#F1F5F9",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#1A1A2E",
          900: "#0F0F1A",
        },
        charcoal: {
          DEFAULT: "#2D2D44",
          light: "#3D3D5C",
          dark: "#1D1D33",
        },
        muted: {
          DEFAULT: "#6B7280",
          dark: "#94A3B8",
        },
      },
      fontFamily: {
        // Use platform system fonts. No custom font is bundled, so these map
        // to the OS defaults (SF Pro on iOS, Roboto on Android for sans;
        // Menlo/monospace for mono).
        sans: ["System"],
        mono: ["Menlo", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
