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
 * Maps the landing form payload to Core's WebLeadIntakeRequest shape:
 * strips non-digits from idNumber/phone (Core enforces exactly 10 chars on
 * phone), renames the frozen simulator terms (term → termMonths,
 * monthlyRate → monthlyInterestRate), and attaches the server-derived
 * clientIp/userAgent and consent hash.
 */
export function buildCoreLeadPayload(input: ApplicationInput, context: CoreLeadContext) {
  // phone2/accountNumber/incomeType son opcionales en landing y no existen aún en Core — no enviar vacíos
  const {
    phone2: _phone2,
    accountNumber: _acc,
    bank: _bank,
    incomeType: _incomeType,
    ...rest
  } = input as ApplicationInput & {
    phone2?: string;
    accountNumber?: string;
    bank?: string;
    incomeType?: string;
  };
  void _phone2;
  void _acc;
  void _incomeType;
  const bank = _bank && _bank.trim() ? _bank : 'PENDIENTE';
  // Mapea roles taxi a enum Core (Core solo conoce Empleado/Independiente/Pensionado)
  const taxiMap: Record<string, string> = {
    'Taxi propio': 'Independiente',
    'Conduzco taxi': 'Independiente',
  };
  const employmentType = taxiMap[input.employmentType] ?? input.employmentType;
  // Convierte ingreso diario a mensual para Core (Core espera mensual)
  let income = input.income;
  if (input.incomeType === 'daily') {
    const d = parseInt((input.income || '').replace(/\D/g, ''), 10);
    if (Number.isFinite(d) && d > 0) {
      const monthly = d * 30;
      income = `$ ${fmtCOP(monthly)}`;
    }
  }
  return {
    ...rest,
    bank,
    employmentType,
    income,
    idNumber: input.idNumber.replace(/\D/g, ""),
    phone: input.phone.replace(/\D/g, ""),
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
