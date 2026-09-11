import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/application-schema";
import {
  checkRateLimit,
  checkOrigin,
  checkCsrf,
  applySecurityHeaders,
  getClientIp,
} from "@/lib/security";
import { config } from "@/lib/config";
import { CoreLeadError, forwardApplicationToCore } from "@/lib/core-lead";

/**
 * Application submit endpoint. Validates the payload with the SAME zod schema
 * the client uses, forwards it to Core's web-lead intake (APPLICATION_ENDPOINT),
 * and returns Core's authoritative radicado. The prototype's fake 1.4s Promise
 * is replaced by this real round-trip.
 *
 * Security: rate-limited (5 req/min/IP), origin check, CSRF via Origin/Referer,
 * security response headers, and a shared `X-Landing-Api-Key` secret (never
 * browser-exposed) on the outbound call to Core.
 *
 * Test hooks: POST with `?forceError=1` returns 500 so the modal's error panel
 * (and draft-preservation) can be exercised, and `?forceSuccess=1` returns a
 * fake radicado (200) so the success panel can be exercised. Both are dev-gated
 * (the client only adds the param when a window flag is set manually).
 */
export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const originResponse = checkOrigin(request);
  if (originResponse) return originResponse;

  const csrfResponse = checkCsrf(request);
  if (csrfResponse) return csrfResponse;

  const url = new URL(request.url);
  if (url.searchParams.get("forceError") === "1") {
    return applySecurityHeaders(
      NextResponse.json(
        { error: "Forced error (test hook)." },
        { status: 500 },
      ),
    );
  }

  // Test hook (dev only — users never send this param): returns a fake Core
  // radicado so the success panel / /s/[radicado] flow can be exercised without
  // an upstream Core. Mirror of forceError above. `withWorkspace=1` simulates a
  // provisioned workspace session (workspace_url) instead of the WhatsApp fallback.
  if (url.searchParams.get("forceSuccess") === "1") {
    const workspaceUrl =
      url.searchParams.get("withWorkspace") === "1"
        ? "https://plataxi.test/workspace/CR-2026-TEST0001"
        : null;
    return applySecurityHeaders(
      NextResponse.json(
        { radicado: "CR-2026-TEST0001", workspaceUrl },
        { status: 200 },
      ),
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return applySecurityHeaders(
      NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    );
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return applySecurityHeaders(
      NextResponse.json(
        { error: "Validación fallida.", issues: parsed.error.flatten() },
        { status: 400 },
      ),
    );
  }

  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    const coreResponse = await forwardApplicationToCore(parsed.data, {
      applicationEndpoint: config.applicationEndpoint,
      landingApiKey: config.landingApiKey,
      clientIp: getClientIp(request),
      userAgent,
    });

    return applySecurityHeaders(
      NextResponse.json(
        {
          radicado: coreResponse.radicado,
          workspaceUrl: coreResponse.workspace_url,
        },
        { status: 200 },
      ),
    );
  } catch (error) {
    const upstreamStatus = error instanceof CoreLeadError ? error.status : undefined;
    const upstreamDetail = error instanceof CoreLeadError ? error.detail : undefined;
    // Server-side diagnosis only: the upstream `detail` (FastAPI's 422 field list,
    // or a plain error body) is logged here but NEVER forwarded to the browser.
    // JSON.stringify expands the nested `detail` list so the exact field/loc/msg
    // is readable in the dev console (console.error collapses nested objects).
    console.error(
      "Core web-lead forwarding failed",
      JSON.stringify(
        {
          upstreamStatus,
          upstreamDetail,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorCause: error instanceof Error ? (error.cause as unknown) : undefined,
        },
        null,
        2,
      ),
    );
    // A Core 429 — its own independent rate limit (5/min), lower than the
    // landing's 10/min — is NOT a backend outage. Surface it as rate_limited
    // with the retry hint so the user sees honest copy instead of a misleading
    // "system is slow" backend error.
    if (upstreamStatus === 429) {
      const retryAfterSeconds =
        error instanceof CoreLeadError ? error.retryAfterSeconds : undefined;
      return applySecurityHeaders(
        NextResponse.json(
          {
            error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos.",
            code: "rate_limited",
            retryAfterSeconds,
          },
          { status: 429, headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {} },
        ),
      );
    }
    // A Core 409 with code "national_id_already_registered" means the cédula is
    // already in an active pipeline. Surface its own code so the client shows
    // the specific message instead of a misleading generic backend error.
    if (upstreamStatus === 409) {
      let code = "backend";
      let message = "No pudimos registrar la solicitud. Intenta nuevamente.";
      const body =
        error instanceof CoreLeadError ? error.detail : undefined;
      if (
        typeof body === "object" &&
        body !== null &&
        "detail" in body &&
        typeof (body as { detail?: unknown }).detail === "object" &&
        (body as { detail?: { code?: unknown } }).detail !== null
      ) {
        const detailCode = (body as { detail?: { code?: unknown } }).detail?.code;
        if (detailCode === "national_id_already_registered") {
          code = "national_id_already_registered";
          const detailError = (body as { detail?: { error?: unknown } }).detail?.error;
          if (typeof detailError === "string" && detailError) {
            message = detailError;
          }
        }
      }
      return applySecurityHeaders(
        NextResponse.json(
          { error: message, code },
          { status: 409 },
        ),
      );
    }
    // Otherwise it's an upstream (Core) failure — which the user should NOT be
    // told is their connection. The client reads `code` for accurate copy.
    return applySecurityHeaders(
      NextResponse.json(
        {
          error: "No pudimos registrar la solicitud. Intenta nuevamente.",
          code: "backend",
          upstreamStatus,
        },
        { status: 502 },
      ),
    );
  }
}
