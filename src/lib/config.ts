/**
 * Plataxi — centralized runtime configuration.
 *
 * Identity, contact, and social facts (site URL, WhatsApp line, legal name/NIT,
 * address, phone, social profile URLs) are CONSTANTS compiled into the build,
 * not environment variables. They never vary between local/staging/prod, so they
 * are baked in here as literal defaults (see the `config` object below).
 *
 * Only genuinely deployment-specific values come from the environment and are
 * guarded by `assertProductionConfig()`: the Core backend endpoints and the
 * web-lead secret (`RATES_CONFIG_ENDPOINT`, `APPLICATION_ENDPOINT`,
 * `LANDING_API_KEY`). These must be set to real values before a production build.
 *
 * Components import from this module; they never hardcode a value.
 */

/** Deployment-specific env keys that MUST be real before production. */
export const PLACEHOLDER_KEYS = [
  "RATES_CONFIG_ENDPOINT",
  "APPLICATION_ENDPOINT",
  "LANDING_API_KEY",
] as const;

export type PlaceholderKey = (typeof PLACEHOLDER_KEYS)[number];

/** Sentinel values the production guard still rejects. */
export const PLACEHOLDERS: Record<PlaceholderKey, string> = {
  RATES_CONFIG_ENDPOINT: "http://localhost:8000/api/v1/sessions/rates-config",
  APPLICATION_ENDPOINT: "http://localhost:8000/api/v1/intake/web-lead",
  LANDING_API_KEY: "dev-landing-api-key-change-in-production",
};

type Env = Record<string, string | undefined>;

/**
 * NOTE on the `read*` helpers below: they take the ALREADY-accessed env value
 * (`value`), not a key to look up dynamically. This is required for Next.js to
 * inline NEXT_PUBLIC_ vars into the client bundle — its compiler only replaces
 * literal `process.env.NEXT_PUBLIC_X` expressions, never a dynamic/computed
 * lookup like `process.env[key]`. Every call site below must therefore pass
 * `process.env.NEXT_PUBLIC_X` literally. (Server-only keys, e.g.
 * APPLICATION_ENDPOINT/LANDING_API_KEY, aren't bundled client-side so this
 * doesn't matter for them, but the same call pattern is used for consistency.)
 */

function read(key: PlaceholderKey, value: string | undefined): string {
  return value && value.length > 0 ? value : PLACEHOLDERS[key];
}

function readNum(value: string | undefined, fallback: number): number {
  if (!value || value.length === 0) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function readStr(value: string | undefined, fallback: string): string {
  return value && value.length > 0 ? value : fallback;
}

function readStrList(value: string | undefined, fallback: string[]): string[] {
  if (!value || value.trim().length === 0) return fallback;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function readNumList(value: string | undefined, fallback: number[]): number[] {
  if (!value || value.trim().length === 0) return fallback;
  const parsed = value.split(",").map((s) => Number(s.trim())).filter(Number.isFinite);
  return parsed.length > 0 ? parsed : fallback;
}

/**
 * Returns the ⚠️ keys whose value is missing or still equal to the placeholder.
 * Pure — accepts an injected env so the production guard can be unit-tested.
 */
export function findUnresolvedPlaceholders(env: Env = process.env): PlaceholderKey[] {
  return PLACEHOLDER_KEYS.filter((key) => {
    const v = env[key];
    return !v || v.length === 0 || v === PLACEHOLDERS[key];
  });
}

/** Placeholder sentinel for the monthly rate (dev/test fallback). */
export const PLACEHOLDER_MONTHLY_RATE = 0.026;

/**
 * Validates the monthly interest rate env var if provided.
 * Optional in production because Core (RATES_CONFIG_ENDPOINT) is the source of truth,
 * with PLACEHOLDER_MONTHLY_RATE (0.026) serving as compile-time offline fallback.
 *
 * Pure — accepts an injected env so the production guard can be unit-tested.
 */
export function findUnresolvedRate(env: Env = process.env): string[] {
  const raw = env.NEXT_PUBLIC_CREDIT_MONTHLY_RATE;
  if (!raw || raw.length === 0) return [];
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n >= 1) return ["NEXT_PUBLIC_CREDIT_MONTHLY_RATE"];
  return [];
}

/**
 * Throws if any ⚠️ placeholder survives or an invalid monthly rate was provided.
 * Intended to run during a production build so we cannot ship with fake backend endpoints.
 * Pure/injectable for tests.
 */
export function assertProductionConfig(env: Env = process.env): void {
  const unresolved = findUnresolvedPlaceholders(env);
  if (unresolved.length > 0) {
    throw new Error(
      "Refusing to build for production: unresolved placeholder config. " +
        "Set real values for the following env vars (see .env.example):\n  - " +
        unresolved.join("\n  - "),
    );
  }
  const unresolvedRate = findUnresolvedRate(env);
  if (unresolvedRate.length > 0) {
    throw new Error(
      "Refusing to build for production: invalid monthly interest rate in NEXT_PUBLIC_CREDIT_MONTHLY_RATE. " +
        "Must be a real decimal between 0 and 1 (e.g. 0.026 for 2.6% monthly).",
    );
  }
}

/** Typed, resolved configuration consumed by the app. */
export const config = {
  /**
   * Pilot disposition (BRAND-001 §2.4): identity, contact and social facts are
   * compiled-in constants, never environment values. The marketing site is the
   * Plataxi-facing surface, and env overrides previously made it possible for
   * the three surfaces to drift. A future client rebrand edits these literals.
   */
  whatsappPhone: "573001234567",
  /** Canonical site origin — drives sitemap, robots, OG, JSON-LD, canonical. */
  siteUrl: "https://plataxi.rubrica.dev",
  company: {
    legalName: "Plataxi S.A.S.",
    nit: "XXX.XXX.XXX-X",
    address: "Domicilio pendiente, Colombia",
    contactPhone: "+573001234567",
  },

  /** Brand display name — used in nav, footer, legal pages, WhatsApp messages, etc. */
  brandName: "Plataxi",

  /** Contact email shown in footer — client requested info@plataxi.com.co (was hola@plataxi.co). */
  contactEmail: "info@plataxi.com.co",

  /** Contact hours shown in footer. */
  contactHours: "Lun a Vie, 8:00–18:00",

  /** Regulator display name (e.g. "Superintendencia Financiera de Colombia"). */
  regulatorName: "Superintendencia Financiera de Colombia",

  /** Short regulator name (e.g. "Superfinanciera"). */
  regulatorShortName: "Superfinanciera",

  social: {
    facebook: "https://facebook.com/plataxi",
    instagram: "https://instagram.com/plataxi",
    linkedin: "https://www.linkedin.com/company/plataxi",
    youtube: "https://www.youtube.com/@plataxi",
  },
  /** Server-only: where app/api/application forwards the submitted application. */
  applicationEndpoint: read("APPLICATION_ENDPOINT", process.env.APPLICATION_ENDPOINT),
  /** Server-only: shared secret sent as `X-Landing-Api-Key` to Core. */
  landingApiKey: read("LANDING_API_KEY", process.env.LANDING_API_KEY),
  /** Server-only: POST /api/application rate limit (req/min per IP). Synced with Core's intake.py. */
  webLeadRateLimitPerMinute: readNum(process.env.WEB_LEAD_RATE_LIMIT_PER_MIN, 5),
  /** Server-only: Core endpoint fetched by the rates-config API route. */
  ratesConfigEndpoint: read("RATES_CONFIG_ENDPOINT", process.env.RATES_CONFIG_ENDPOINT),
  /**
   * Gates the "Vigilados por Superfinanciera" / "Entidad vigilada" claims.
   * Compliance-sensitive: the seal and regulator copy render ONLY when this is
   * explicitly "true". Defaults to false (claim hidden) until legal signs off.
   */
  regulatorVerified: process.env.NEXT_PUBLIC_REGULATOR_VERIFIED === "true",

  /** --- Simulator / product parameters — A (hide rates) + max 6 meses (varios plazos 1-6) + 4 freqs Diario/Semanal/Quincenal/Mensual --- */
  simulator: {
    amountMin: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_MIN, 20000),
    amountMax: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_MAX, 1000000),
    amountStep: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_STEP, 10000),
    amountStepBig: readNum(process.env.NEXT_PUBLIC_SIM_AMOUNT_STEP_BIG, 50000),
    defaultAmount: readNum(process.env.NEXT_PUBLIC_SIM_DEFAULT_AMOUNT, 500000),
    defaultTerm: readNum(process.env.NEXT_PUBLIC_SIM_DEFAULT_TERM, 3),
    /** Comma-separated term options in months — varios plazos previos hasta 6: [1,2,3,4,5,6] (was [3,6,9,12,18,24]). */
    termOptions: readNumList(process.env.NEXT_PUBLIC_SIM_TERM_OPTIONS, [1, 2, 3, 4, 5, 6]),
  },

  /** --- Credit rate (interim — will come from Plataxi dashboard API) --- */
  credit: {
    /** Monthly interest rate as decimal (e.g. 0.026 = 2.6%). */
    monthlyRate: readNum(process.env.NEXT_PUBLIC_CREDIT_MONTHLY_RATE, 0.026),
    /** Eligibility: high-amount threshold above which a minimum term applies. */
    highAmountThreshold: readNum(process.env.NEXT_PUBLIC_CREDIT_HIGH_AMOUNT_THRESHOLD, 800000),
    /** Eligibility: min term (months) for amounts above highAmountThreshold. */
    highAmountMinTerm: readNum(process.env.NEXT_PUBLIC_CREDIT_HIGH_AMOUNT_MIN_TERM, 6),
    /** Administración: cuota fija por crédito (ej: 8.000 COP total). */
    adminFeeTotal: readNum(process.env.NEXT_PUBLIC_CREDIT_ADMIN_FEE_TOTAL, 8000),
    /** Fianza: garantía por crédito (ej: 12.000 COP total). */
    guaranteeFeeTotal: readNum(process.env.NEXT_PUBLIC_CREDIT_GUARANTEE_FEE_TOTAL, 12000),
  },

  /** --- Application form options --- */
  application: {
    /** Comma-separated bank names for the bank dropdown. */
    banks: readStrList(
      process.env.NEXT_PUBLIC_APPLICATION_BANKS,
      ["Bancolombia", "Davivienda", "BBVA", "Banco de Bogotá", "Nequi", "Daviplata"],
    ),
    /** Comma-separated taxi roles for the employment dropdown (taxi-first pilot). */
    employmentTypes: readStrList(
      process.env.NEXT_PUBLIC_APPLICATION_EMPLOYMENT_TYPES,
      ["Taxi propio", "Conduzco taxi", "Empleado", "Independiente"],
    ),
  },

  /** --- Brand colors (CSS hex, used for manifest/theme-color) --- */
  colors: {
    navy: readStr(process.env.NEXT_PUBLIC_COLOR_NAVY, "#111110"),
    orange: readStr(process.env.NEXT_PUBLIC_COLOR_ORANGE, "#f6d860"),
    green: readStr(process.env.NEXT_PUBLIC_COLOR_GREEN, "#f6d860"),
    primaryDark: "#111110",
    primaryBrand: "#f6d860",
    secondarySurface: "#fffbe0",
    secondaryText: "#757575",
    secondaryBorder: "#c1c1c1",
  },

  /** --- Disbursement time claim (e.g. "24 horas"). Empty = no claim shown (compliance-safe). --- */
  disbursementTime: readStr(process.env.NEXT_PUBLIC_DISBURSEMENT_TIME, ""),

  /** --- GTM/GA4 container ID (optional — if set, the GTM script is loaded) --- */
  gtmId: readStr(process.env.NEXT_PUBLIC_GTM_ID, ""),
} as const;

// Fail a production build if any ⚠️ value is still a placeholder. Dev and test
// runtimes are intentionally exempt so the page renders from `.env.example`.
// Server-only: server-secret keys (e.g. APPLICATION_ENDPOINT) are never inlined
// into the client bundle, so the guard must not run in the browser.
if (
  process.env.NODE_ENV === "production" &&
  typeof window === "undefined" &&
  process.env.NEXT_PUBLIC_PLATAXI_ALLOW_PLACEHOLDERS !== "true"
) {
  assertProductionConfig();
}
