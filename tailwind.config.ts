import type { Config } from "tailwindcss";

// Every token resolves to one of the 5 palette colors (or white). Utilities are
// built from the channel triplets in globals.css rather than from the finished
// var(--token) colors: Tailwind drops an opacity modifier it cannot split into
// channels, which silently deleted ~55 tint utilities (border-green/20,
// ring-white/12, bg-navy/90 …) and let ring-1 fall back to its default blue.
const tint = (channels: string) => `rgb(var(${channels}) / <alpha-value>)`;

const DARK = "--color-primary-dark-rgb";
const BRAND = "--color-primary-brand-rgb";
const SURFACE = "--color-secondary-surface-rgb";
const TEXT = "--color-secondary-text-rgb";
const TEXT_AA = "--color-secondary-text-aa-rgb";
const LINE = "--color-secondary-border-rgb";
const WHITE = "--color-white-rgb";
const ERROR = "--color-feedback-error-rgb";

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
        "primary-dark": tint(DARK),
        "primary-brand": tint(BRAND),
        "secondary-surface": tint(SURFACE),
        "secondary-text": tint(TEXT),
        "secondary-border": tint(LINE),

        // Feedback colors (user states only, not brand identity).
        "feedback-error": { DEFAULT: tint(ERROR), bg: tint(SURFACE) },
        "feedback-success": { DEFAULT: tint(BRAND), bg: tint(SURFACE) },

        // ShadCN semantic tokens
        background: tint(WHITE),
        foreground: tint(DARK),
        card: { DEFAULT: tint(WHITE), foreground: tint(DARK) },
        popover: { DEFAULT: tint(WHITE), foreground: tint(DARK) },
        primary: { DEFAULT: tint(DARK), foreground: tint(WHITE) },
        secondary: { DEFAULT: tint(BRAND), foreground: tint(DARK) },
        muted: { DEFAULT: tint(SURFACE), foreground: tint(TEXT_AA) },
        accent: { DEFAULT: tint(SURFACE), foreground: tint(DARK) },
        destructive: { DEFAULT: tint(ERROR), foreground: tint(WHITE) },
        border: tint(LINE),
        input: tint(LINE),
        ring: tint(DARK),

        // Semantic surface tokens — white canvas, cream raised, onyx dark
        surface: {
          primary: tint(WHITE),
          card: tint(SURFACE),
          secondary: tint(WHITE),
          tertiary: tint(SURFACE),
          dark: tint(DARK),
          "dark-card": tint(DARK),
        },

        // Semantic text tokens
        text: {
          primary: tint(DARK),
          secondary: tint(TEXT_AA),
          muted: tint(TEXT_AA),
          inverse: tint(WHITE),
        },

        // Semantic brand tokens
        brand: {
          primary: tint(DARK),
          accent: tint(BRAND),
          orange: tint(BRAND),
        },

        // Semantic status tokens (estrictamente 5 colores)
        status: {
          success: { DEFAULT: tint(BRAND), bg: tint(SURFACE), text: tint(DARK) },
          warning: { DEFAULT: tint(BRAND), bg: tint(SURFACE), text: tint(DARK) },
          error: { DEFAULT: tint(DARK), bg: tint(SURFACE), text: tint(DARK) },
          info: { DEFAULT: tint(DARK), bg: tint(SURFACE), text: tint(DARK) },
        },

        // Brand tokens — Plataxi mono-accent (compatibilidad)
        navy: { DEFAULT: tint(DARK), deep: tint(DARK), ink: tint(DARK) },
        orange: { DEFAULT: tint(BRAND), ink: tint(DARK) },
        green: { DEFAULT: tint(BRAND), ink: tint(DARK), soft: tint(SURFACE), "soft-ink": tint(DARK), tint: tint(SURFACE), bright: tint(BRAND) },
        ink: tint(DARK),
        "muted-2": tint(TEXT_AA),
        "bg-soft": tint(WHITE),
        "border-2": tint(LINE),
        error: tint(DARK),
        "hint-ink": tint(DARK),
        "hint-bg": tint(SURFACE),
      },

      // Opacity steps used by tint utilities in the codebase. A modifier whose
      // value is not in this scale is dropped, so /12 and /15 need declaring
      // even though they read like arbitrary numbers.
      opacity: {
        12: "0.12",
        15: "0.15",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        65: "0.65",
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
      // Display scale — trust-first fintech, not indrive shout:
      // hero 32-56 (vs 36-64) and section 30-44 (vs 36-64) — hero still dominates via photo + scrim, not type.
      // Smaller clamp (5.5vw/4.5vw vs 6.5vw) + relaxed line-height 1.25 for section tames 64px shout on 390.
      fontSize: {
        hero: ["clamp(2rem, 5.5vw, 3.5rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        section: ["clamp(1.875rem, 4.5vw, 2.75rem)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
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
