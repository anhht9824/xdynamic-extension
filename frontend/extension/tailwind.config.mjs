/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "extension/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
        glass: "12px",
        "glass-light": "8px",
        "glass-heavy": "16px",
      },
      backgroundColor: {
        "glass-light": "rgba(255, 255, 255, 0.1)",
        "glass-medium": "rgba(255, 255, 255, 0.2)",
        "glass-dark": "rgba(0, 0, 0, 0.2)",
        "glass-dark-medium": "rgba(0, 0, 0, 0.3)",
      },
      borderColor: {
        "glass-light": "rgba(255, 255, 255, 0.3)",
        "glass-dark": "rgba(255, 255, 255, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in": "slideIn 0.2s ease-out",
        "glass-shimmer": "shimmer 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        glass: "12px",
        "glass-sm": "8px",
        "glass-lg": "16px",
        "glass-xl": "20px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      boxShadow: {
        "glass-light":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "glass-medium":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "glass-heavy":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".glass-light": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          "box-shadow":
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        ".glass-medium": {
          background: "rgba(255, 255, 255, 0.2)",
          "backdrop-filter": "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          "box-shadow":
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        ".glass-heavy": {
          background: "rgba(255, 255, 255, 0.3)",
          "backdrop-filter": "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          "box-shadow":
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        ".dark .glass-light": {
          background: "rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".dark .glass-medium": {
          background: "rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".dark .glass-heavy": {
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-hover": {
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
            background: "rgba(255, 255, 255, 0.25)",
          },
        },
        ".dark .glass-hover:hover": {
          background: "rgba(0, 0, 0, 0.35)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
