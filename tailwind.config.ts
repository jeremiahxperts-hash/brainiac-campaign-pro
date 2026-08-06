import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        // Brainiac Promotion Studio brand ramp
        void: "#190019", // deepest bg
        eggplant: "#2B124C", // panel bg
        mulberry: "#522B5B", // mid accent / borders
        mauve: "#854F6C", // secondary accent
        blossom: "#DFB6B2", // highlight / warm accent
        cream: "#FBE4D8", // light bg / paper

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
        xl: "calc(var(--radius) + 6px)",
        "2xl": "calc(var(--radius) + 14px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "brainiac-glow":
          "radial-gradient(60% 50% at 50% 0%, rgba(133,79,108,0.35) 0%, rgba(43,18,76,0) 70%)",
        "brainiac-mesh":
          "radial-gradient(40% 40% at 15% 20%, rgba(223,182,178,0.18) 0%, rgba(223,182,178,0) 60%), radial-gradient(35% 45% at 85% 10%, rgba(82,43,91,0.35) 0%, rgba(82,43,91,0) 60%), radial-gradient(50% 50% at 50% 100%, rgba(25,0,25,0.6) 0%, rgba(25,0,25,0) 60%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(25, 0, 25, 0.28)",
        "glass-lg": "0 20px 60px -12px rgba(25, 0, 25, 0.45)",
        glow: "0 0 0 1px rgba(223,182,178,0.15), 0 8px 24px -4px rgba(133,79,108,0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(223,182,178,0.5)" },
          "70%": { boxShadow: "0 0 0 10px rgba(223,182,178,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(223,182,178,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.6s infinite linear",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
