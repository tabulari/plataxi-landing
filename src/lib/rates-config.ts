export interface RuntimeRatesConfig {
  monthlyRate: number;
  amountMin: number;
  amountMax: number;
  termOptions: number[];
  /** Frequency IDs offered by the admin. Fallback: four standard frequencies. */
  offeredFrequencies: string[];
}

const STANDARD_FREQUENCIES = ['daily', 'weekly', 'biweekly', 'monthly'] as const;

type FetchLike = typeof fetch;

export function parseRatesConfig(payload: unknown): RuntimeRatesConfig | null {
  if (typeof payload !== "object" || payload === null) return null;

  const record = payload as Record<string, unknown>;
  const monthlyRate = Number(record.monthly_interest_rate);
  const amountMin = Number(record.min_amount);
  const amountMax = Number(record.max_amount);
  const termOptions = Array.isArray(record.term_options_months)
    ? record.term_options_months.map(Number)
    : [];

  if (
    !Number.isFinite(monthlyRate) ||
    monthlyRate <= 0 ||
    !Number.isFinite(amountMin) ||
    amountMin <= 0 ||
    !Number.isFinite(amountMax) ||
    amountMax <= amountMin ||
    termOptions.length === 0 ||
    termOptions.some((term) => !Number.isInteger(term) || term <= 0)
  ) {
    return null;
  }

  const KNOWN_FREQUENCIES = new Set(['daily', 'weekly', 'biweekly', 'monthly']);
  const rawFreqs = record.offered_frequencies;
  const offeredFrequencies: string[] =
    Array.isArray(rawFreqs) && rawFreqs.every((f) => typeof f === 'string' && KNOWN_FREQUENCIES.has(f))
      ? rawFreqs
      : [...STANDARD_FREQUENCIES];

  return {
    monthlyRate,
    amountMin,
    amountMax,
    termOptions: [...new Set(termOptions)].sort((a, b) => a - b),
    offeredFrequencies,
  };
}

export async function loadRatesConfig(
  endpoint: string,
  fetchImpl: FetchLike = fetch,
): Promise<RuntimeRatesConfig | null> {
  try {
    const response = await fetchImpl(endpoint, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return null;
    return parseRatesConfig(await response.json());
  } catch {
    return null;
  }
}

export type RatesSource = "core" | "fallback";

export interface InitialRatesResult {
  rates: RuntimeRatesConfig;
  source: RatesSource;
}

/**
 * Server-side helper for seeding the SimulatorProvider during SSR/ISR.
 * Calls Core directly (server-to-server, no self-fetch through the proxy) and
 * falls back to config-derived static values when Core is unreachable.
 *
 * Core es la fuente de verdad: tasa, montos Y plazos vienen del backoffice
 * (financial_settings). El fallback solo se usa si Core no responde.
 */
export async function getInitialRates(
  endpoint: string,
  fallback: RuntimeRatesConfig,
  fetchImpl: FetchLike = fetch,
): Promise<InitialRatesResult> {
  const coreRates = await loadRatesConfig(endpoint, fetchImpl);
  if (coreRates) {
    // Core es la fuente de verdad para tasa, montos y plazos: se respeta tal cual.
    return { rates: coreRates, source: "core" };
  }
  return { rates: fallback, source: "fallback" };
}
