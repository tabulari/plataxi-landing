import { createHash } from "node:crypto";
import type { ApplicationInput } from "./application-schema";
import { CONSENT_TEXT } from "./application-schema";
import { fmtCOP } from "./credit";

type FetchLike = typeof fetch;

export interface CoreLeadContext {
  applicationEndpoint: string;
  landingApiKey: string;
  clientIp: string;
  userAgent: string;
}

export interface CoreLeadResponse {
  radicado: string;
  application_id: string;
  customer_id: string;
  workspace_url: string | null;
}

export class CoreLeadError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    /** Seconds the caller should wait before retrying (Core's 429 response). */
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
  }
}

/** Best-effort extraction of Core's FastAPI error body: `{detail: {retry_after_seconds}}`. */
function extractCoreRetryAfter(body: string): number | undefined {
  try {
    const detail = (JSON.parse(body) as { detail?: { retry_after_seconds?: number } }).detail;
    const n = detail?.retry_after_seconds;
    return typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.ceil(n) : undefined;
  } catch {
    return undefined;
  }
}

/** SHA-256 of the canonical consent sentence — Core stores this as consent evidence. */
export function consentTextHash(): string {
  return createHash("sha256").update(CONSENT_TEXT, "utf8").digest("hex");
}

/**
 * Maps the landing form payload to Core's WebLeadIntakeRequest shape (IP-163).
 * Strips non-digits from idNumber/phone, renames simulator terms, converts
 * daily income to monthly, and maps hasBank "yes"/"no" to boolean.
 */
export function buildCoreLeadPayload(input: ApplicationInput, context: CoreLeadContext) {
  // Convierte ingreso diario a mensual (Core espera el monto mensual)
  let income = input.income;
  if (input.incomeType === 'daily') {
    const d = parseInt((input.income || '').replace(/\D/g, ''), 10);
    if (Number.isFinite(d) && d > 0) {
      income = `$ ${fmtCOP(d * 30)}`;
    }
  }

  return {
    // Step 1
    fullName: input.fullName,
    idNumber: input.idNumber.replace(/\D/g, ''),
    phone: input.phone.replace(/\D/g, ''),
    contactName: input.contactName || null,
    contactPhone: input.contactPhone ? input.contactPhone.replace(/\D/g, '') : null,
    email: input.email,
    // Step 2
    taxiRole: input.taxiRole === 'Taxi propio' ? 'taxi_propio' : 'conduzco_taxi',
    taxiPlate: input.taxiPlate || null,
    taxiCompany: input.taxiCompany,
    drivingTime: input.drivingTime === 'lt1' ? 0 : input.drivingTime === '1to3' ? 2 : 6,
    // Step 3
    income,
    hasBank: input.hasBank === 'yes',
    bankEntity: input.bankEntity || null,
    // Consent
    consent: input.consent,
    clientIp: context.clientIp,
    userAgent: context.userAgent,
    consentTextHash: consentTextHash(),
    terms: {
      amount: input.terms.amount,
      termMonths: input.terms.term,
      monthlyInterestRate: input.terms.monthlyRate,
      frequency: input.terms.frequency,
    },
  };
}

export async function forwardApplicationToCore(
  input: ApplicationInput,
  context: CoreLeadContext,
  fetchImpl: FetchLike = fetch,
): Promise<CoreLeadResponse> {
  const response = await fetchImpl(context.applicationEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Landing-Api-Key": context.landingApiKey,
    },
    body: JSON.stringify(buildCoreLeadPayload(input, context)),
    cache: "no-store",
  });

  if (!response.ok) {
    let retryAfterSeconds: number | undefined;
    try {
      retryAfterSeconds = extractCoreRetryAfter(await response.text());
    } catch {
      /* body unreadable — fall through with status only */
    }
    throw new CoreLeadError("Core rejected the web lead", response.status, retryAfterSeconds);
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("radicado" in payload) ||
    typeof payload.radicado !== "string" ||
    !payload.radicado
  ) {
    throw new CoreLeadError("Core returned an invalid web-lead response");
  }

  return payload as CoreLeadResponse;
}
