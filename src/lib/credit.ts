/**
 * Plataxi — isolated credit logic (PURE).
 *
 * Ported verbatim from the design prototype `app.js` (sections 1 & 2). All
 * credit math + eligibility rules live here and nowhere else, so the real
 * pricing engine can be swapped in without touching any UI. Keep the
 * signatures and return shapes stable.
 *
 * Rate and eligibility thresholds are sourced from config (env-driven).
 * Internal identifiers are English; user-facing strings (the eligibility
 * `message` and the display `unit` "/mes" · "/quincena") stay in Spanish.
 */

import { config } from './config';

export type Frequency = "monthly" | "biweekly";

export interface Simulation {
  amount: number;
  term: number; // months
  frequency: Frequency;
  payment: number; // COP per period (rounded)
  totalCost: number; // COP (= rounded payment × nPeriods — matters for display parity)
  periodRate: number; // decimal, per period
  monthlyRate: number; // decimal, monthly
  ea: number; // decimal, effective annual (E.A.)
  nPeriods: number;
  unit: "/mes" | "/quincena";
  valid: boolean; // false when the amount/term combo isn't offered
  message: string; // guidance shown to the user when !valid
}

export interface Validity {
  ok: boolean;
  message: string;
}

/**
 * Eligibility / constraint rules. Returns { ok, message } — message is shown to
 * the user and the apply CTA is disabled while ok === false.
 *
 * Thresholds default to config (env-driven, interim until real rate engine).
 */
export function validateApplication(
  amount: number,
  termMonths: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _frequency: Frequency,
): Validity {
  const { smallAmountThreshold, smallAmountMaxTerm, highAmountThreshold, highAmountMinTerm } = config.credit;

  if (amount < smallAmountThreshold && termMonths >= smallAmountMaxTerm) {
    return {
      ok: false,
      message:
        `Este monto no aplica para plazos de ${smallAmountMaxTerm} meses o más. Reduce el plazo o aumenta el monto.`,
    };
  }
  if (amount > highAmountThreshold && termMonths < highAmountMinTerm) {
    return {
      ok: false,
      message:
        `Para montos superiores a $${fmtCOP(highAmountThreshold)} el plazo mínimo es de ${highAmountMinTerm} meses.`,
    };
  }
  return { ok: true, message: "" };
}

export function calculatePayment(
  amount: number,
  termMonths: number,
  frequency: Frequency,
  monthlyRate: number = config.credit.monthlyRate,
): Simulation {
  const MONTHLY_RATE = monthlyRate;
  const isBiweekly = frequency === "biweekly";

  const periodsPerMonth = isBiweekly ? 2 : 1;
  const nPeriods = termMonths * periodsPerMonth;
  const periodRate = isBiweekly ? MONTHLY_RATE / 2 : MONTHLY_RATE;

  // Standard amortized payment: P * i / (1 - (1+i)^-n)
  const factor = Math.pow(1 + periodRate, -nPeriods);
  const payment = Math.round((amount * periodRate) / (1 - factor));

  const totalCost = payment * nPeriods; // derived from the ROUNDED payment (display parity)
  const ea = Math.pow(1 + MONTHLY_RATE, 12) - 1; // annual equivalent
  const validity = validateApplication(amount, termMonths, frequency);

  return {
    amount,
    term: termMonths,
    frequency,
    payment,
    totalCost,
    periodRate, // decimal, per period
    monthlyRate: MONTHLY_RATE, // decimal, monthly
    ea, // decimal, annual
    nPeriods,
    unit: isBiweekly ? "/quincena" : "/mes",
    valid: validity.ok, // false when the combo is not offered
    message: validity.message, // guidance to show the user
  };
}

/* ---------- FORMATTING HELPERS (presentation only) ---------- */

/**
 * Colombian: thousands separated by ".", decimals by ",".
 * The prototype replaced U+00A0 with "."; `\s` generalizes that to every
 * group-separator variant ICU may emit (space, U+00A0, U+202F) so output is
 * stable across Node/ICU builds. On this runtime es-CO already groups with
 * ".", making the replace a no-op.
 */
export function fmtCOP(n: number): string {
  return Math.round(n).toLocaleString("es-CO").replace(/\s/g, ".");
}

export function formatCurrencyCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function fmtPct(decimal: number, dec: number): string {
  return (decimal * 100).toFixed(dec).replace(".", ",");
}
