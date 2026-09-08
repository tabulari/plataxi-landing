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

export type Frequency = "daily" | "weekly" | "biweekly" | "monthly" | "bimonthly" | "quarterly";

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
  unit: "/día" | "/semana" | "/quincena" | "/mes" | "/bimestre" | "/trimestre";
  isEstimate: boolean;
  adminFeePerPeriod: number; // COP por cuota (administración)
  guaranteeFeeTotal: number; // COP total fianza
  valid: boolean; // false when the amount/term combo isn't offered
  message: string; // guidance shown to the user when !valid
}

export interface Validity {
  ok: boolean;
  message: string;
}

/**
 * Single source of truth para qué plazos están deshabilitados según el monto.
 * Usado tanto por validateApplication (bloqueo CTA) como por Simulator (chips disabled).
 */
export function isTermDisabled(amount: number, termMonths: number): boolean {
  if (amount <= config.simulator.amountMin && termMonths !== 1) return true;
  if (amount > config.credit.highAmountThreshold && termMonths < config.credit.highAmountMinTerm) return true;
  return false;
}

export function getDisabledTerms(amount: number, termOptions: number[]): number[] {
  return termOptions.filter((t) => isTermDisabled(amount, t));
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
  if (!isTermDisabled(amount, termMonths)) return { ok: true, message: "" };

  const { highAmountThreshold, highAmountMinTerm } = config.credit;
  if (amount <= config.simulator.amountMin) {
    return {
      ok: false,
      message: `Para el monto mínimo de $${fmtCOP(config.simulator.amountMin)} el plazo disponible es de 1 mes.`,
    };
  }
  return {
    ok: false,
    message: `Para montos superiores a $${fmtCOP(highAmountThreshold)} el plazo mínimo es de ${highAmountMinTerm} meses.`,
  };
}

export function calculatePayment(
  amount: number,
  termMonths: number,
  frequency: Frequency,
  monthlyRate: number = config.credit.monthlyRate,
): Simulation {
  const MONTHLY_RATE = monthlyRate;
  // periodsPerMonth: how many payments per calendar month (< 1 for multi-month periods)
  const periodsPerMonth =
    frequency === "daily" ? 30
    : frequency === "weekly" ? 4
    : frequency === "biweekly" ? 2
    : frequency === "bimonthly" ? 0.5   // 1 payment every 2 months
    : frequency === "quarterly" ? 1 / 3  // 1 payment every 3 months
    : 1;
  const nPeriods = termMonths * periodsPerMonth;
  const periodRate = MONTHLY_RATE / periodsPerMonth;

  // Standard amortized payment: P * i / (1 - (1+i)^-n)
  const factor = Math.pow(1 + periodRate, -nPeriods);
  const payment = Math.round((amount * periodRate) / (1 - factor));

  const totalCost = payment * nPeriods; // derived from the ROUNDED payment (display parity)
  const ea = Math.pow(1 + MONTHLY_RATE, 12) - 1; // annual equivalent
  const validity = validateApplication(amount, termMonths, frequency);
  const adminFeeTotal = config.credit.adminFeeTotal;
  const guaranteeFeeTotal = config.credit.guaranteeFeeTotal;
  const adminFeePerPeriod = Math.round(adminFeeTotal / nPeriods);

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
    unit:
      frequency === "daily" ? "/día"
      : frequency === "weekly" ? "/semana"
      : frequency === "biweekly" ? "/quincena"
      : frequency === "bimonthly" ? "/bimestre"
      : frequency === "quarterly" ? "/trimestre"
      : "/mes",
    isEstimate: frequency === "bimonthly" || frequency === "quarterly",
    adminFeePerPeriod,
    guaranteeFeeTotal,
    valid: validity.ok, // false when the combo is not offered
    message: validity.message, // guidance to show the user
  };
}

/* ---------- FORMATTING HELPERS (presentation only) ---------- */

/**
 * Colombian: thousands separated by "." (no decimals). Deterministic by
 * construction — no `toLocaleString`/ICU — so server and client (any engine)
 * tag the same string, immune to locale/CLDR variance.
 */
export function fmtCOP(n: number): string {
  const sign = n < 0 ? "-" : "";
  const digits = Math.round(Math.abs(n)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatCurrencyCOP(n: number): string {
  return `$${fmtCOP(n)}`;
}

export function fmtPct(decimal: number, dec: number): string {
  return (decimal * 100).toFixed(dec).replace(".", ",");
}
