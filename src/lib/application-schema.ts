import { z } from "zod";
import { config } from "./config";

/**
 * Single source of validation for the application form — used by the client
 * (inline per-field + per-step) AND the server route. Rules and messages are
 * ported verbatim from the prototype `solicitud.js` RULES. Field identifiers
 * are English; user-facing messages/options stay Spanish.
 *
 * Banks and employment types come from config (env-driven).
 */

export const EMPLOYMENT_TYPES = config.application.employmentTypes;
export const BANKS = config.application.banks;

const MSG = {
  fullName: "¿Cómo te llamas? Nombre y apellido.",
  idNumber: "Revisa tu cédula. 7 a 10 dígitos.",
  phone: "Teléfono inválido. 10 dígitos, empieza en 3.",
  phone2: "Si lo pones, que sea un número distinto y válido.",
  email: "Ese correo no se ve bien.",
  employmentType: "Elige en qué trabajas.",
  income: "Cuéntanos cuánto ganas.",
  incomeType: "Elige diario o mensual.",
  bank: "Elige dónde te consignamos.",
  accountNumber: "Número de cuenta inválido. 7 a 20 dígitos.",
  consent: "Autoriza el tratamiento de datos para seguir.",
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digits = (s: string) => s.replace(/\D/g, "");

/** Per-field schemas — reused for inline client validation and the composite. */
export const fieldSchemas = {
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
  phone2: z.string().refine((v) => {
    if (!v || v.trim() === "") return true;
    const d = digits(v);
    return d.length === 10 && d.startsWith("3");
  }, MSG.phone2),
  email: z.string().refine((v) => EMAIL_RE.test(v.trim()), MSG.email),
  employmentType: z
    .string()
    .refine((v) => (EMPLOYMENT_TYPES as readonly string[]).includes(v), MSG.employmentType),
  income: z.string().refine((v) => digits(v).length >= 5, MSG.income),
  incomeType: z.enum(["daily", "monthly"], { message: MSG.incomeType }),
  bank: z.string().refine((v) => (BANKS as readonly string[]).includes(v), MSG.bank),
  accountNumber: z.string().refine((v) => {
    if (!v || v.trim() === "") return true;
    const d = digits(v);
    return d.length >= 7 && d.length <= 20;
  }, MSG.accountNumber),
} as const;

export type FieldName = keyof typeof fieldSchemas;

export const STEP_FIELDS: Record<number, FieldName[]> = {
  1: ["fullName", "idNumber", "phone", "phone2", "email"],
  2: ["employmentType", "income", "incomeType"],
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

/** Validate one field; returns the error message ("" when valid). */
export function validateField(name: FieldName, value: string): string {
  const r = fieldSchemas[name].safeParse(value);
  return r.success ? "" : (r.error.issues[0]?.message ?? "Valor inválido");
}

/** Composite schema for the server route (and a full client check). */
export const applicationSchema = z
  .object({
    fullName: fieldSchemas.fullName,
    idNumber: fieldSchemas.idNumber,
    phone: fieldSchemas.phone,
    phone2: fieldSchemas.phone2.optional().or(z.literal("")),
    email: fieldSchemas.email,
    employmentType: fieldSchemas.employmentType,
    income: fieldSchemas.income,
    incomeType: fieldSchemas.incomeType.default("monthly"),
    bank: fieldSchemas.bank.optional().or(z.literal("")),
    accountNumber: fieldSchemas.accountNumber.optional().or(z.literal("")),
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
      const p1 = (data.phone || "").replace(/\D/g, "");
      const p2 = (data.phone2 || "").replace(/\D/g, "");
      if (!p2) return true;
      return p1 !== p2;
    },
    { message: "Que sea distinto al primero.", path: ["phone2"] },
  );

export type ApplicationInput = z.infer<typeof applicationSchema>;
