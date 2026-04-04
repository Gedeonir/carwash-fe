/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Serif Display", "Georgia", "serif"],
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // 🟡 PRIMARY — Yellow brand accent
        primary: {
          50:  "#FFFDE7",
          100: "#FFF9C4",
          200: "#FFF59D",
          300: "#FFF176",
          400: "#FFEE58",
          500: "#F5C542", // 🔥 MAIN BRAND COLOR
          600: "#F0B429",
          700: "#D49B18",
          800: "#A37510",
          900: "#7A5508",
        },
        // ⚫ SURFACE — True blacks
        surface: {
          50:  "#F7F7F7",
          100: "#EBEBEB",
          200: "#D4D4D4",
          300: "#B0B0B0",
          400: "#888888",
          500: "#5A5A5A",
          600: "#3A3A3A",
          700: "#262626",
          800: "#171717", // 🔥 main dark background
          900: "#0A0A0A", // deepest background
        },
        // ⚪ ACCENT — Whites
        accent: {
          50:  "#FFFFFF",
          100: "#FAFAFA",
          200: "#F5F5F5",
          300: "#E8E8E8",
          400: "#D1D1D1",
          500: "#BBBBBB",
          600: "#999999",
        },
        // Semantic
        success: "#22C55E",
        warning: "#F59E0B",
        error:   "#EF4444",
        info:    "#3B82F6",
      },
      fontSize: {
        xs:    ["0.75rem",  { lineHeight: "1rem" }],
        sm:    ["0.875rem", { lineHeight: "1.25rem" }],
        base:  ["1rem",     { lineHeight: "1.6rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem",  { lineHeight: "2.5rem" }],
        "5xl": ["3rem",     { lineHeight: "1.1" }],
        "6xl": ["3.75rem",  { lineHeight: "1.05" }],
      },
      borderRadius: {
        sm:      "0.25rem",
        DEFAULT: "0.375rem",
        md:      "0.5rem",
        lg:      "0.75rem",
        xl:      "1rem",
        "2xl":   "1.5rem",
        full:    "9999px",
      },
      boxShadow: {
        sm:       "0 1px 2px rgba(0,0,0,0.4)",
        DEFAULT:  "0 1px 4px rgba(0,0,0,0.5)",
        md:       "0 4px 12px rgba(0,0,0,0.5)",
        lg:       "0 8px 24px rgba(0,0,0,0.6)",
        xl:       "0 20px 40px rgba(0,0,0,0.7)",
        card:     "0 2px 8px rgba(245,197,66,0.08)",
        glow:     "0 0 24px rgba(245,197,66,0.3)",
        "glow-lg":"0 0 48px rgba(245,197,66,0.2)",
      },
      animation: {
        "fade-in":        "fadeIn 0.4s ease forwards",
        "slide-up":       "slideUp 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        "slide-down":     "slideDown 0.3s ease forwards",
        "scale-in":       "scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "slide-in-right": "slideInRight 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
      },
      keyframes: {
        fadeIn:       { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:      { from: { opacity: "0", transform: "translateY(12px)" },  to: { opacity: "1", transform: "translateY(0)" } },
        slideDown:    { from: { opacity: "0", transform: "translateY(-8px)" },  to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn:      { from: { opacity: "0", transform: "scale(0.95)" },       to: { opacity: "1", transform: "scale(1)" } },
        slideInRight: { from: { opacity: "0", transform: "translateX(24px)" },  to: { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};