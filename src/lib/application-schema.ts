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
  fullName: "Ingresa tu nombre y apellido.",
  idNumber: "Ingresa un número de cédula válido (7 a 10 dígitos).",
  phone: "Ingresa un celular colombiano válido (10 dígitos, inicia en 3).",
  email: "Ingresa un correo válido.",
  employmentType: "Selecciona tu tipo de empleo.",
  income: "Ingresa tu ingreso mensual.",
  bank: "Selecciona tu banco.",
  consent: "Debes autorizar el tratamiento de datos para continuar.",
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
  email: z.string().refine((v) => EMAIL_RE.test(v.trim()), MSG.email),
  employmentType: z
    .string()
    .refine((v) => (EMPLOYMENT_TYPES as readonly string[]).includes(v), MSG.employmentType),
  income: z.string().refine((v) => digits(v).length >= 5, MSG.income),
  bank: z.string().refine((v) => (BANKS as readonly string[]).includes(v), MSG.bank),
} as const;

export type FieldName = keyof typeof fieldSchemas;

export const STEP_FIELDS: Record<number, FieldName[]> = {
  1: ["fullName", "idNumber", "phone", "email"],
  2: ["employmentType", "income", "bank"],
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
export const applicationSchema = z.object({
  fullName: fieldSchemas.fullName,
  idNumber: fieldSchemas.idNumber,
  phone: fieldSchemas.phone,
  email: fieldSchemas.email,
  employmentType: fieldSchemas.employmentType,
  income: fieldSchemas.income,
  bank: fieldSchemas.bank,
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
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
