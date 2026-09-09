import { NextResponse } from "next/server";
import { applySecurityHeaders } from "@/lib/security";
import { config } from "@/lib/config";

/**
 * Proxies the Core bank list (IP-163) so the client-side Step3 bank selector
 * can be populated without exposing LANDING_API_KEY to the browser.
 *
 * The list is relatively static — a stale-while-revalidate response is fine.
 */
export async function GET() {
  const banksEndpoint = config.applicationEndpoint.replace(
    "/api/v1/intake/web-lead",
    "/api/v1/intake/banks",
  );

  try {
    const res = await fetch(banksEndpoint, {
      headers: { "X-Landing-Api-Key": config.landingApiKey },
      next: { revalidate: 3600 }, // cache for 1h
    });

    if (!res.ok) {
      return applySecurityHeaders(
        NextResponse.json({ banks: [] }, { status: 200 }),
      );
    }

    const data = (await res.json()) as { banks?: string[] };
    return applySecurityHeaders(
      NextResponse.json({ banks: data.banks ?? [] }, { status: 200 }),
    );
  } catch {
    // Degrade gracefully — Step3 renders an empty select rather than crashing.
    return applySecurityHeaders(
      NextResponse.json({ banks: [] }, { status: 200 }),
    );
  }
}
