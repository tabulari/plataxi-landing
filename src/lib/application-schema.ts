import { z } from "zod";

/**
 * Single source of validation for the application form — used by the client
 * (inline per-field + per-step) AND the server route. Field identifiers are
 * English; user-facing messages/options stay Spanish.
 *
 * IP-163: expanded to 4-step flow (Tus datos → Tu taxi → Tus ingresos → Revisión).
 */

export const TAXI_ROLES = ["Taxi propio", "Conduzco taxi"] as const;
export type TaxiRole = (typeof TAXI_ROLES)[number];

const MSG = {
  fullName: "¿Cómo te llamas? Nombre y apellido.",
  idNumber: "Revisa tu cédula. 7 a 10 dígitos.",
  phone: "Teléfono inválido. 10 dígitos, empieza en 3.",
  contactPhone: "Si lo pones, que sea un número válido de 10 dígitos.",
  email: "Ese correo no se ve bien.",
  taxiRole: "Elige tu rol en el taxi.",
  taxiPlate: "Ingresa la placa del taxi.",
  taxiCompany: "Ingresa la empresa a la que estás afiliado.",
  drivingTime: "Indica cuántos años llevas conduciendo.",
  income: "Cuéntanos cuánto ganas.",
  incomeType: "Elige diario o mensual.",
  hasBank: "Indica si tienes entidad bancaria.",
  bankEntity: "Elige tu entidad bancaria.",
  consent: "Autoriza el tratamiento de datos para seguir.",
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
  contactName: z.string(), // optional — always valid (validated per-step as needed)
  contactPhone: z.string().refine((v) => {
    if (!v || v.trim() === "") return true;
    const d = digits(v);
    return d.length === 10 && d.startsWith("3");
  }, MSG.contactPhone),
  email: z.string().refine((v) => EMAIL_RE.test(v.trim()), MSG.email),

  // Step 2 — Tu taxi
  taxiRole: z
    .string()
    .refine((v) => (TAXI_ROLES as readonly string[]).includes(v), MSG.taxiRole),
  taxiPlate: z.string(), // conditional — validated cross-field in validateStep
  taxiCompany: z.string().refine((v) => v.trim().length >= 2, MSG.taxiCompany),
  drivingTime: z.enum(['lt1', '1to3', 'gt5'], { message: MSG.drivingTime }),

  // Step 3 — Tus ingresos
  income: z.string().refine((v) => digits(v).length >= 5, MSG.income),
  incomeType: z.enum(["daily", "monthly"], { message: MSG.incomeType }),
  hasBank: z.enum(["yes", "no"], { message: MSG.hasBank }),
  bankEntity: z.string(), // conditional — validated cross-field in validateStep
} as const;

export type FieldName = keyof typeof fieldSchemas;

export const STEP_FIELDS: Record<number, FieldName[]> = {
  1: ["fullName", "idNumber", "phone", "email"],
  // contactName/contactPhone are optional — not in required validation list
  2: ["taxiRole", "taxiCompany", "drivingTime"],
  // taxiPlate is conditional on taxiRole — handled in validateStep
  3: ["income", "incomeType", "hasBank"],
  // bankEntity is conditional on hasBank="yes" — handled in validateStep
};

export const CONSENT_MESSAGE = MSG.consent;

/**
 * Canonical consent text. Must stay byte-identical to the authorization
 * sentence rendered in the apply form (FormSteps Step4) — Core stores a
 * SHA-256 of this string as consent evidence, so any drift breaks the audit
 * trail. Keep this and the JSX in sync.
 */
export const CONSENT_TEXT =
  "Autorizo el tratamiento de mis datos personales conforme a la Política de Privacidad y la Ley 1581 de 2012 (Habeas Data).";

/** Validate one field; returns the error message ("" when valid). */
export function validateField(name: FieldName, value: string): string {
  const r = fieldSchemas[name].safeParse(value);
  return r.success ? "" : (r.error.issues[0]?.message ?? "Valor inválido");
}

/** Composite schema for the server route (and a full client check). */
export const applicationSchema = z
  .object({
    // Step 1
    fullName: fieldSchemas.fullName,
    idNumber: fieldSchemas.idNumber,
    phone: fieldSchemas.phone,
    contactName: z.string().optional().or(z.literal("")),
    contactPhone: fieldSchemas.contactPhone.optional().or(z.literal("")),
    email: fieldSchemas.email,
    // Step 2
    taxiRole: fieldSchemas.taxiRole,
    taxiPlate: z.string().optional().or(z.literal("")),
    taxiCompany: fieldSchemas.taxiCompany,
    drivingTime: fieldSchemas.drivingTime,
    // Step 3
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
