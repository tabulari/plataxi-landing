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
        // 5 Primary & Secondary Color Utility Tokens
        "primary-dark": "var(--color-primary-dark)",
        "primary-brand": "var(--color-primary-brand)",
        "secondary-surface": "var(--color-secondary-surface)",
        "secondary-text": "var(--color-secondary-text)",
        "secondary-border": "var(--color-secondary-border)",

        // ShadCN semantic tokens
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

        // Semantic surface tokens
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
          dark: "var(--surface-dark)",
          "dark-card": "var(--surface-dark-card)",
        },

        // Semantic text tokens
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },

        // Semantic brand tokens
        brand: {
          primary: "var(--brand-primary)",
          accent: "var(--brand-accent)",
          orange: "var(--brand-orange)",
        },

        // Semantic status tokens
        status: {
          success: {
            DEFAULT: "var(--status-success)",
            bg: "var(--status-success-bg)",
            text: "var(--status-success-text)",
          },
          warning: {
            DEFAULT: "var(--status-warning)",
            bg: "var(--status-warning-bg)",
            text: "var(--status-warning-text)",
          },
          error: {
            DEFAULT: "var(--status-error)",
            bg: "var(--status-error-bg)",
            text: "var(--status-error-text)",
          },
          info: {
            DEFAULT: "var(--status-info)",
            bg: "var(--status-info-bg)",
            text: "var(--status-info-text)",
          },
        },

        // Brand tokens — Plataxi mono-accent (compatibilidad)
        navy: { DEFAULT: "var(--navy)", deep: "var(--navy-deep)", ink: "var(--navy-ink)" },
        orange: { DEFAULT: "var(--orange)", ink: "var(--orange-ink)" },
        green: { DEFAULT: "var(--green)", ink: "var(--green-ink)", soft: "var(--green-soft)", "soft-ink": "var(--green-soft-ink)", tint: "var(--green-tint)", bright: "var(--green-bright)" },
        ink: "var(--ink)",
        "muted-2": "var(--muted-2)",
        "bg-soft": "var(--bg-soft)",
        "border-2": "var(--border-2)",
        error: "var(--destructive)",
        "hint-ink": "var(--hint-ink)",
        "hint-bg": "var(--hint-bg)",
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
