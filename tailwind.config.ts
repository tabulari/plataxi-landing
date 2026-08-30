import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: { DEFAULT: "1120px" },
    },
    extend: {
      colors: {
        // ShadCN semantic tokens → brand colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Brand tokens — Plataxi mono-accent (names kept, values remapped to yellow + neutrals)
        navy: { DEFAULT: "#151515", deep: "#0a0a0a", ink: "#151515" },
        orange: { DEFAULT: "#ffdd00", ink: "#151515" },
        green: { DEFAULT: "#ffdd00", ink: "#151515", soft: "#fffbe0", "soft-ink": "#151515", tint: "#fffee9", bright: "#ffe84d" },
        ink: "#151515",
        "muted-2": "#797979",
        "bg-soft": "#f7f7f5",
        "border-2": "#ececec",
        error: "#c5392c",
        "hint-ink": "#8a6d00",
        "hint-bg": "#fffbe0",
      },
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "Roboto",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Roboto",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "22px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(16,32,64,.05), 0 1px 3px rgba(16,32,64,.06)",
        md: "0 6px 24px rgba(13,42,94,.07), 0 2px 6px rgba(13,42,94,.05)",
        lg: "0 24px 60px rgba(13,42,94,.14), 0 8px 24px rgba(13,42,94,.08)",
      },
      maxWidth: {
        container: "1120px",
      },
      screens: {
        sm: "600px",
        md: "720px",
        lg: "760px",
        timeline: "880px",
        stack: "980px",
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
