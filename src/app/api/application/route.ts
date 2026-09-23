import { NextRequest, NextResponse } from "next/server";
import { applicationSchema, type SubmitErrorCode } from "@/lib/application-schema";
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
 * and returns Core's authoritative radicado.
 *
 * Security: rate-limited (5 req/min/IP), origin check, CSRF via Origin/Referer,
 * security response headers, and a shared `X-Landing-Api-Key` secret (never
 * browser-exposed) on the outbound call to Core.
 *
 * Failures carry a `code` (see SubmitErrorCode) that the client maps to copy.
 */
function failure(
  status: number,
  code: SubmitErrorCode,
  error: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) {
  return applySecurityHeaders(
    NextResponse.json({ error, code, ...extra }, { status, headers }),
  );
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const originResponse = checkOrigin(request);
  if (originResponse) return originResponse;

  const csrfResponse = checkCsrf(request);
  if (csrfResponse) return csrfResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failure(400, "invalid", "Invalid JSON body.");
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return failure(400, "invalid", "Validación fallida.", {
      issues: parsed.error.flatten(),
    });
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
    // A Core 429 — its own independent rate limit (5/min) — is NOT a backend
    // outage. Surface it as rate_limited with the retry hint so the user sees
    // honest copy instead of a misleading "system is slow" backend error.
    if (upstreamStatus === 429) {
      const retryAfterSeconds =
        error instanceof CoreLeadError ? error.retryAfterSeconds : undefined;
      return failure(
        429,
        "rate_limited",
        "Demasiadas solicitudes. Intenta de nuevo en unos segundos.",
        { retryAfterSeconds },
        retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {},
      );
    }
    // A Core 409 with code "national_id_already_registered" means the cédula is
    // already in an active pipeline. Any other 409 is an upstream failure.
    if (upstreamStatus === 409) {
      const detail = (upstreamDetail as { detail?: { code?: unknown } } | undefined)?.detail;
      if (detail?.code === "national_id_already_registered") {
        return failure(
          409,
          "national_id_already_registered",
          "Ya existe una solicitud con este documento.",
        );
      }
      return failure(409, "backend", "No pudimos registrar la solicitud. Intenta nuevamente.");
    }
    // A Core 422 is either an identity conflict (phone/email registered to
    // another ID) or a field Core rejected. Both need the applicant to edit, so
    // neither may read as an outage.
    if (upstreamStatus === 422) {
      const isIdentityConflict = JSON.stringify(upstreamDetail ?? "").includes("identity_conflict");
      return failure(
        422,
        isIdentityConflict ? "identity_conflict" : "invalid",
        isIdentityConflict
          ? "El número de teléfono o correo ya está asociado a otro documento de identidad."
          : "Core rechazó uno de los datos enviados.",
      );
    }
    // Otherwise it's an upstream (Core) failure — which the user should NOT be
    // told is their connection. The client reads `code` for accurate copy.
    return failure(
      502,
      "backend",
      "No pudimos registrar la solicitud. Intenta nuevamente.",
      { upstreamStatus },
    );
  }
}
