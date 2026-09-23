import { z } from "zod";

/**
 * Single source of validation for the application form — used by the client
 * (inline per-field + per-step) AND the server route. Field identifiers are
 * English; user-facing messages/options stay Spanish.
 *
 * Flow: 3 pasos (Tus datos → Tus ingresos → Revisión) tras ADR-0002.
 */

export const TAXI_ROLES = ["Taxi propio", "Conduzco taxi"] as const;
export type TaxiRole = (typeof TAXI_ROLES)[number];

const MSG = {
  fullName: "Ingresa tu nombre y apellido.",
  idNumber: "Revisa tu cédula.",
  phone: "Revisa tu teléfono.",
  contactName: "Ingresa el nombre de tu contacto de referencia.",
  contactPhone: "Revisa el teléfono de tu contacto.",
  email: "Ingresa un correo válido.",
  taxiRole: "Elige tu rol en el taxi.",
  taxiPlate: "Ingresa la placa del taxi.",
  taxiCompany: "Ingresa la empresa a la que estás afiliado.",
  drivingTime: "Indica cuántos años llevas conduciendo.",
  income: "Indica cuánto ganas en números.",
  incomeType: "Elige diario o mensual.",
  hasBank: "Indica si tienes entidad bancaria.",
  bankEntity: "Elige tu entidad bancaria.",
  consent: "Autoriza el tratamiento de datos para enviar la solicitud.",
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digits = (s: string) => s.replace(/\D/g, "");

/** Per-field schemas — reused for inline client validation and the composite. */
export const fieldSchemas = {
  // Step 1 — Tus datos
  fullName: z
    .string()
    .refine((v) => v.trim().length >= 5 && v.trim().includes(" "), MSG.fullName),
  idNumber: z.string().refine((v) => {
    const len = digits(v).length;
    return len >= 7 && len <= 10;
  }, MSG.idNumber),
  phone: z.string().refine((v) => {
    const d = digits(v);
    return d.length === 10 && d.startsWith("3");
  }, MSG.phone),
  contactName: z
    .string()
    .refine((v) => v.trim().length >= 3, MSG.contactName),
  contactPhone: z.string().refine((v) => {
    const d = digits(v);
    return d.length === 10 && d.startsWith("3");
  }, MSG.contactPhone),
  email: z.string().refine((v) => EMAIL_RE.test(v.trim()), MSG.email),

  // Step 2 — Tu taxi (Opcional en captación inicial; diferido a Oferta de Préstamo según ADR-0002)
  taxiRole: z
    .string()
    .refine((v) => !v || (TAXI_ROLES as readonly string[]).includes(v), MSG.taxiRole)
    .optional(),
  taxiPlate: z.string().optional(),
  taxiCompany: z.string().optional(),
  drivingTime: z.enum(['lt1', '1to3', '3to5', 'gt5']).optional(),

  // Step 2 (en UI) — Tus ingresos
  income: z.string().refine((v) => digits(v).length >= 5, MSG.income),
  incomeType: z.enum(["daily", "monthly"], { message: MSG.incomeType }),
  hasBank: z.enum(["yes", "no"], { message: MSG.hasBank }),
  bankEntity: z.string(), // conditional — validated cross-field in validateStep
} as const;

export type FieldName = keyof typeof fieldSchemas;

export const STEP_FIELDS: Record<number, FieldName[]> = {
  1: ["fullName", "idNumber", "phone", "email", "contactName", "contactPhone"],
  2: ["income", "incomeType", "hasBank"],
  // bankEntity is conditional on hasBank="yes" — handled in validateStep
};

export const CONSENT_MESSAGE = MSG.consent;

/**
 * Canonical consent text. Must stay byte-identical to the authorization
 * sentence rendered in the apply form (FormSteps Step3) — Core stores a
 * SHA-256 of this string as consent evidence, so any drift breaks the audit
 * trail. Keep this and the JSX in sync.
 */
export const CONSENT_TEXT =
  "Autorizo el tratamiento de mis datos personales conforme a la Política de Privacidad y la Ley 1581 de 2012 (Habeas Data).";

/**
 * Every failure code the submit endpoint can return, and the only place they
 * are declared. The route emits them, the form hook reads them, and the error
 * panel maps them to copy. `invalid` and `identity_conflict` are fixable by the
 * applicant (edit and resend); the rest are not.
 */
export type SubmitErrorCode =
  | "rate_limited"
  | "national_id_already_registered"
  | "identity_conflict"
  | "invalid"
  | "backend"
  | "connection";

/** Codes where retrying the same payload can never succeed. */
export const EDITABLE_ERROR_CODES: readonly SubmitErrorCode[] = [
  "national_id_already_registered",
  "identity_conflict",
  "invalid",
];

/** Validate one field; returns the error message ("" when valid). */
export function validateField(name: FieldName, value: string): string {
  const schema = fieldSchemas[name];
  if (!schema) return "";
  const r = schema.safeParse(value);
  return r.success ? "" : (r.error.issues[0]?.message ?? "Valor inválido");
}

/** Composite schema for the server route (and a full client check). */
export const applicationSchema = z
  .object({
    // Step 1
    fullName: fieldSchemas.fullName,
    idNumber: fieldSchemas.idNumber,
    phone: fieldSchemas.phone,
    contactName: fieldSchemas.contactName,
    contactPhone: fieldSchemas.contactPhone,
    email: fieldSchemas.email,
    // Step 2 (opcional en landing, diferido a oferta según ADR-0002)
    taxiRole: z.string().optional().or(z.literal("")),
    taxiPlate: z.string().optional().or(z.literal("")),
    taxiCompany: z.string().optional().or(z.literal("")),
    drivingTime: z.string().optional().or(z.literal("")),
    // Step 2 en UI: Ingresos
    income: fieldSchemas.income,
    incomeType: fieldSchemas.incomeType.default("monthly"),
    hasBank: fieldSchemas.hasBank,
    bankEntity: z.string().optional().or(z.literal("")),
    consent: z.boolean().refine((v) => v === true, { message: MSG.consent }),
    // Frozen simulator snapshot shown to the applicant and locked by Core.
    terms: z
      .object({
        amount: z.number().positive(),
        term: z.number().int().positive(),
        monthlyRate: z.number().positive(),
        frequency: z.enum(["daily", "weekly", "biweekly", "monthly"]),
      })
      .passthrough(),
  })
  .refine(
    (data) => {
      if (data.taxiRole === "Taxi propio" && !data.taxiPlate?.trim()) return false;
      return true;
    },
    { message: MSG.taxiPlate, path: ["taxiPlate"] },
  )
  .refine(
    (data) => {
      if (data.hasBank === "yes" && !data.bankEntity?.trim()) return false;
      return true;
    },
    { message: MSG.bankEntity, path: ["bankEntity"] },
  );

export type ApplicationInput = z.infer<typeof applicationSchema>;
