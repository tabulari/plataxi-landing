import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { loadRatesConfig } from "@/lib/rates-config";

/**
 * Same-origin proxy endpoint for rates config.
 * Prevents browser CORS errors when connecting to the Core rates engine
 * by performing the upstream fetch on the server side with fallback to static config.
 */
export async function GET() {
  const rates = await loadRatesConfig(config.ratesConfigEndpoint);
  if (!rates) {
    console.warn(
      `[rates-config] Core unreachable at ${config.ratesConfigEndpoint}; ` +
        `serving config fallback rate ${config.credit.monthlyRate}.`,
    );
    return NextResponse.json({
      monthly_interest_rate: config.credit.monthlyRate,
      min_amount: config.simulator.amountMin,
      max_amount: config.simulator.amountMax,
      term_options_months: config.simulator.termOptions,
      source: "fallback",
    });
  }

  // Core ya no sirve plazos (sin elección de plazo): se completan con los estáticos
  // internos para que el simulador siga calculando sin mostrar selector.
  const termOptions =
    rates.termOptions.length > 0 ? rates.termOptions : config.simulator.termOptions;

  return NextResponse.json({
    monthly_interest_rate: rates.monthlyRate,
    min_amount: rates.amountMin,
    max_amount: rates.amountMax,
    term_options_months: termOptions,
    source: "core",
  });
}
