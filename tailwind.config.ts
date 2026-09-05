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
          card: "var(--surface-card)",
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
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Archivo",
          "system-ui",
          "sans-serif",
        ],
      },
      // inDrive normalizes every card, panel and button on 16px. xl/2xl/3xl are
      // aliased so existing rounded-2xl / rounded-3xl usages flatten without
      // touching each component.
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "16px",
        "2xl": "16px",
        "3xl": "16px",
        pill: "999px",
      },
      // Display scale, measured off indrive.com/es-co/money at 390px and 1440px:
      // the h1 and the section h2 are the SAME size at every breakpoint —
      // 36px/43px on mobile, 64px/77px on desktop, both 1.2 line-height and
      // -0.02em tracking. inDrive gets hero dominance from the full-bleed photo,
      // not from type size, so `hero` and `section` are deliberately identical.
      // The two names are kept so components stay semantically readable.
      fontSize: {
        hero: ["clamp(2.25rem, 6.5vw, 4rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        section: ["clamp(2.25rem, 6.5vw, 4rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(17,17,16,.05), 0 1px 3px rgba(17,17,16,.06)",
        md: "0 6px 24px rgba(17,17,16,.07), 0 2px 6px rgba(17,17,16,.05)",
        lg: "0 24px 60px rgba(17,17,16,.14), 0 8px 24px rgba(17,17,16,.08)",
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
