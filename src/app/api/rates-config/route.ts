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
    return NextResponse.json({
      monthly_interest_rate: config.credit.monthlyRate,
      min_amount: config.simulator.amountMin,
      max_amount: config.simulator.amountMax,
      term_options_months: config.simulator.termOptions,
    });
  }

  return NextResponse.json({
    monthly_interest_rate: rates.monthlyRate,
    min_amount: rates.amountMin,
    max_amount: rates.amountMax,
    term_options_months: rates.termOptions,
  });
}
