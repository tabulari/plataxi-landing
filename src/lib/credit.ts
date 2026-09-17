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
  adminFeePerPeriod: number; // COP por cuota (plataforma)
  guaranteeFeeTotal: number; // COP total fianza
  legalInterestAmount: number; // COP interés legal SFC (3.4% simple por mes)
  platformFeeAmount: number; // COP servicio plataforma (+3.0% opcional)
  guaranteeFeeAmount: number; // COP servicio fianza (+3.6% opcional)
  acceptsPlatform: boolean;
  acceptsGuarantee: boolean;
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
 * - Hasta $150.000 (ej: 100k, 150k): solo 1 mes habilitado (obligatorio).
 * - De $200.000 a menos de $300.000: 1 y 2 meses habilitados.
 * - A partir de $300.000: 1, 2 y 3 meses habilitados.
 */
export function isTermDisabled(amount: number, termMonths: number): boolean {
  if (amount <= 150000 && termMonths > 1) return true;
  if (amount < 300000 && termMonths > 2) return true;
  return false;
}

export function getDisabledTerms(amount: number, termOptions: number[]): number[] {
  return termOptions.filter((t) => isTermDisabled(amount, t));
}

/**
 * Forma de pago en frecuencia de pago debe estar normal sin deshabilitar ningún botón.
 * Todas las frecuencias ofrecidas (daily, weekly, biweekly, monthly) están siempre habilitadas.
 */
export function isFrequencyDisabled(amount: number, frequency: Frequency): boolean {
  if (frequency === "bimonthly" || frequency === "quarterly") return true;
  return false;
}

/**
 * Eligibility / constraint rules. Returns { ok, message } — message is shown to
 * the user and the apply CTA is disabled while ok === false.
 */
export function validateApplication(
  amount: number,
  termMonths: number,
  frequency: Frequency,
): Validity {
  if (isTermDisabled(amount, termMonths)) {
    if (amount <= 150000) {
      return {
        ok: false,
        message: `Para montos de hasta $${fmtCOP(150000)} el plazo disponible es de 1 mes.`,
      };
    }
    if (amount < 300000) {
      return {
        ok: false,
        message: `Para montos inferiores a $${fmtCOP(300000)} el plazo máximo es de 2 meses.`,
      };
    }
    return {
      ok: false,
      message: "La combinación de monto y plazo seleccionada no está disponible.",
    };
  }

  if (isFrequencyDisabled(amount, frequency)) {
    return {
      ok: false,
      message: "La forma de pago seleccionada no está disponible.",
    };
  }

  return { ok: true, message: "" };
}

export function calculatePayment(
  amount: number,
  termMonths: number,
  frequency: Frequency,
  monthlyRate: number = config.credit.monthlyRate,
  acceptsPlatform: boolean = true,
  acceptsGuarantee: boolean = true,
  platformFeeRate: number = config.credit.platformFeeRate,
  guaranteeFeeRate: number = config.credit.guaranteeFeeRate,
): Simulation {
  // 1. Tasa de interés mensual simple, servida por Core (financial_settings).
  // Tope regulatorio: 3.4% mensual (DOMAIN-011 INV-1); 1 MES = r% | 2 MES = 2r% | 3 MES = 3r%
  const termInterestPct = monthlyRate * termMonths;
  const legalInterestAmount = Math.round(amount * termInterestPct);

  // 2. Servicios Opcionales (previa autorización del usuario), tasas servidas
  // por Core: Plataforma sobre el capital + Fianza sobre el capital.
  const platformFeeAmount = acceptsPlatform ? Math.round(amount * platformFeeRate) : 0;
  const guaranteeFeeAmount = acceptsGuarantee ? Math.round(amount * guaranteeFeeRate) : 0;

  // Fórmula literal: capital + % de plazo + plataforma + fianza = cuota dividida en día, semana, quincena o mes
  const totalCost = amount + legalInterestAmount + platformFeeAmount + guaranteeFeeAmount;

  // Divisores de tecla:
  // 1) La tecla DIARIO divide en 30
  // 2) La tecla SEMANAL divide en 4
  // 3) La tecla QUINCENAL divide en 2
  // 4) La tecla mensual deja todo igual (divide en 1)
  const divisor =
    frequency === "daily" ? 30
    : frequency === "weekly" ? 4
    : frequency === "biweekly" ? 2
    : 1;

  const payment = Math.round(totalCost / divisor);
  const nPeriods = divisor;
  const periodRate = termInterestPct / divisor;
  const ea = Math.pow(1 + monthlyRate, 12) - 1;
  const validity = validateApplication(amount, termMonths, frequency);

  return {
    amount,
    term: termMonths,
    frequency,
    payment,
    totalCost,
    periodRate,
    monthlyRate,
    ea,
    nPeriods,
    unit:
      frequency === "daily" ? "/día"
      : frequency === "weekly" ? "/semana"
      : frequency === "biweekly" ? "/quincena"
      : frequency === "bimonthly" ? "/bimestre"
      : frequency === "quarterly" ? "/trimestre"
      : "/mes",
    isEstimate: frequency === "bimonthly" || frequency === "quarterly",
    adminFeePerPeriod: Math.round(platformFeeAmount / nPeriods),
    guaranteeFeeTotal: guaranteeFeeAmount,
    legalInterestAmount,
    platformFeeAmount,
    guaranteeFeeAmount,
    acceptsPlatform,
    acceptsGuarantee,
    valid: validity.ok,
    message: validity.message,
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
