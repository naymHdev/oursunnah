/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: "#1B4332",
          "emerald-light": "#2D6A4F",
          "emerald-pale": "#40916C",
          olive: "#3B3A1A",
          "olive-mid": "#6B6B2A",
          beige: "#F5EFE6",
          "beige-dark": "#EDE0CE",
          cream: "#FAF8F4",
          "cream-warm": "#F7F1E8",
          gold: "#B8975A",
          "gold-light": "#D4AF6A",
          "gold-pale": "#E8D5A3",
          charcoal: "#1C1C1C",
          "charcoal-soft": "#2E2E2E",
          stone: "#8C8270",
          "stone-light": "#B5A98C",
        },
        /* shadcn/ui CSS variable mappings */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 2px 20px rgba(27, 67, 50, 0.06)",
        "card-hover": "0 8px 40px rgba(27, 67, 50, 0.12)",
        gold: "0 4px 20px rgba(184, 151, 90, 0.25)",
      },
    },
  },
  plugins: [],
};
