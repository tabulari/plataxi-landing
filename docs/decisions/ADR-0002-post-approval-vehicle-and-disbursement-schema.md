# ADR-0002 — Diferir datos de vehículo ("Tu taxi") y cuenta de desembolso a la etapa de Oferta de Préstamo (Loan Offer)

- **Estado:** Aceptado
- **Fecha:** 2026-09-12
- **Ámbito:** `plataxi-landing`, `core` (intake vs loan-offer formalization)
- **Servicios relacionados:** Credalia `core` (API de intake y formalización de crédito), Credalia `backoffice`, Plataxi Landing (`/`, `/s/[token]`)

---

## 1. Contexto y Problema

En la versión inicial de captación web (IP-163), el formulario de solicitud en la landing page (`ApplyModal`) se estructuró en 4 pasos:
1. **Tus datos:** Nombre, cédula de ciudadanía, celular, contacto secundario, correo.
2. **Tu taxi:** Rol en el taxi (propio vs conduzco), placa del vehículo, empresa afiliada, años conduciendo taxi.
3. **Tus ingresos:** Ingresos (diario o mensual), tenencia de entidad bancaria y selección de banco.
4. **Revisión:** Aceptación de términos y consentimiento Habeas Data.

### Problemas Detectados

1. **Fricción innecesaria y abandono en el embudo (Drop-off):**
   Los taxistas acceden a la landing predominantemente desde dispositivos móviles tras interactuar con el simulador. Exigir datos vehiculares específicos (como la empresa afiliada exacta o la placa) en la etapa de captación inicial genera un alto abandono antes de que el usuario conozca si califica para el crédito o qué condiciones se le ofrecen.
2. **Momento inadecuado para la recolección de datos bancarios de desembolso:**
   Solicitar el **número de cuenta bancaria** en el formulario público de la landing genera desconfianza y fricción de seguridad. El solicitante aún no tiene una oferta de crédito aprobada. El momento óptimo y seguro para pedir el número de cuenta y verificar la titularidad es cuando la solicitud ya fue pre-aprobada por el motor de scoring y se formaliza el desembolso.
3. **Desacoplamiento de Garantía y Dispersión:**
   Los datos del vehículo actúan comercialmente y operativamente como validación de perfil y eventual garantía prendaria o vinculación de flota. Esta información debe asociarse formalmente al contrato de crédito y al pagaré, no a un lead inicial.

---

## 2. Decisión

1. **Eliminar el paso "Tu taxi" de la captación inicial en la Landing:**
   - El formulario de la landing page se simplifica de 4 a **3 pasos ágiles**:
     - **Paso 1: Tus datos** (identidad y contacto).
     - **Paso 2: Tus ingresos** (ingreso diario/mensual y tenencia de banco).
     - **Paso 3: Revisión** (resumen financiero y consentimiento Ley 1581 / Habeas Data).
   - El adaptador cliente-servidor (`src/lib/core-lead.ts`) envía valores de compatibilidad neutros para no romper instancias de backend existentes mientras se completa la migración en `core`.

2. **Diferir datos del vehículo y cuenta bancaria a la etapa de Oferta de Préstamo (Loan Offer):**
   - Una vez que la solicitud pasa scoring y el prestatario accede a su **Espacio Digital / Workspace** (`/s/[token]`, Stage 4: Aprobación de Oferta / Formalización), se presenta la oferta definitiva.
   - En este punto, para proceder a la firma electrónica del contrato (OTP) y desembolso (Stage 5 y 6), se solicita:
     1. **Datos de la cuenta de desembolso:** Banco, tipo de cuenta (ahorros/corriente), número de cuenta bancaria y certificación de titularidad personal.
     2. **Datos del taxi:** Rol de tenencia (propietario o conductor), placa, empresa de taxi y tarjeta de operación (si aplica).

---

## 3. Borrador de Schema Técnico (Draft Contract)

Para la implementación del endpoint de formalización y aceptación de oferta en `core` (`POST /api/v1/applications/{radicado}/accept-offer` o `POST /api/v1/workspace/{token}/disbursement-setup`), se establece el siguiente borrador de schema:

### 3.1. Definición en TypeScript con Zod

```typescript
import { z } from 'zod';

/** Formato oficial de placa de servicio público / particular en Colombia: 3 letras y 3 dígitos */
const COLOMBIAN_PLATE_REGEX = /^[A-Z]{3}\d{3}$/;
const ACCOUNT_NUMBER_REGEX = /^\d{8,18}$/;

/** Schema de la cuenta bancaria de desembolso */
export const DisbursementAccountSchema = z.object({
  /** Código o identificador del banco en la Superintendencia Financiera */
  bankCode: z.string().min(2, "Selecciona la entidad bancaria"),
  bankName: z.string().min(2),
  accountType: z.enum(["ahorros", "corriente"], {
    errorMap: () => ({ message: "Elige si la cuenta es de ahorros o corriente" }),
  }),
  /** Número de cuenta bancaria (entre 8 y 18 dígitos según entidad) */
  accountNumber: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => ACCOUNT_NUMBER_REGEX.test(val), {
      message: "El número de cuenta debe tener entre 8 y 18 dígitos",
    }),
  /** Confirmación de que el solicitante es el titular único de la cuenta */
  isAccountHolder: z.literal(true, {
    errorMap: () => ({ message: "La cuenta de desembolso debe estar a nombre del titular de la solicitud" }),
  }),
  /** URL o token de archivo del certificado bancario (opcional según monto/score) */
  certificationDocumentUrl: z.string().url().optional().nullable(),
});

/** Schema de validación y vinculación del vehículo / taxi */
export const TaxiDetailsSchema = z.object({
  taxiRole: z.enum(["taxi_propio", "conduzco_taxi"], {
    errorMap: () => ({ message: "Selecciona si eres propietario o conductor del taxi" }),
  }),
  taxiPlate: z
    .string()
    .transform((val) => val.toUpperCase().replace(/[\s-]/g, ''))
    .refine((val) => COLOMBIAN_PLATE_REGEX.test(val), {
      message: "Ingresa una placa válida (ej: ABC 123)",
    }),
  taxiCompany: z.string().trim().min(2, "Ingresa la empresa de taxis a la que estás afiliado"),
  drivingYears: z.number().int().min(0).max(60, "Años de conducción inválidos"),
  /** Número de tarjeta de operación (opcional en primer filtro, requerido para desembolso) */
  operationCardNumber: z.string().trim().optional().nullable(),
});

/** Schema consolidado de Aceptación de Oferta de Préstamo */
export const LoanOfferAcceptanceSchema = z.object({
  radicado: z.string().min(8),
  offerId: z.string().uuid(),
  acceptedTerms: z.object({
    amount: z.number().positive(),
    termMonths: z.number().int().positive(),
    monthlyInterestRate: z.number().positive(),
    frequency: z.enum(["daily", "weekly", "biweekly", "monthly"]),
    installmentAmount: z.number().positive(),
    totalCost: z.number().positive(),
  }),
  disbursementAccount: DisbursementAccountSchema,
  taxiDetails: TaxiDetailsSchema,
  otpVerification: z.object({
    otpCode: z.string().length(6, "El código de verificación debe tener 6 dígitos"),
    verifiedAt: z.string().datetime(),
    deviceIp: z.string(),
  }),
});

export type DisbursementAccountInput = z.infer<typeof DisbursementAccountSchema>;
export type TaxiDetailsInput = z.infer<typeof TaxiDetailsSchema>;
export type LoanOfferAcceptanceInput = z.infer<typeof LoanOfferAcceptanceSchema>;
```

### 3.2. Representación en JSON Schema (Borrador OpenAPI / Core FastAPI)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LoanOfferAcceptanceRequest",
  "type": "object",
  "required": [
    "radicado",
    "offerId",
    "acceptedTerms",
    "disbursementAccount",
    "taxiDetails",
    "otpVerification"
  ],
  "properties": {
    "radicado": { "type": "string", "example": "CR-2026-000492" },
    "offerId": { "type": "string", "format": "uuid" },
    "acceptedTerms": {
      "type": "object",
      "required": ["amount", "termMonths", "frequency", "installmentAmount"],
      "properties": {
        "amount": { "type": "integer", "minimum": 100000, "maximum": 1000000 },
        "termMonths": { "type": "integer", "enum": [1, 2, 3] },
        "frequency": { "type": "string", "enum": ["daily", "weekly", "biweekly", "monthly"] },
        "installmentAmount": { "type": "integer" },
        "monthlyInterestRate": { "type": "number" },
        "totalCost": { "type": "integer" }
      }
    },
    "disbursementAccount": {
      "type": "object",
      "required": ["bankCode", "accountType", "accountNumber", "isAccountHolder"],
      "properties": {
        "bankCode": { "type": "string", "example": "1007" },
        "bankName": { "type": "string", "example": "Bancolombia" },
        "accountType": { "type": "string", "enum": ["ahorros", "corriente"] },
        "accountNumber": { "type": "string", "pattern": "^\\d{8,18}$", "example": "12345678901" },
        "isAccountHolder": { "type": "boolean", "const": true },
        "certificationDocumentUrl": { "type": ["string", "null"], "format": "uri" }
      }
    },
    "taxiDetails": {
      "type": "object",
      "required": ["taxiRole", "taxiPlate", "taxiCompany", "drivingYears"],
      "properties": {
        "taxiRole": { "type": "string", "enum": ["taxi_propio", "conduzco_taxi"] },
        "taxiPlate": { "type": "string", "pattern": "^[A-Z]{3}\\d{3}$", "example": "WHA123" },
        "taxiCompany": { "type": "string", "example": "Radio Taxi Aeropuerto" },
        "drivingYears": { "type": "integer", "minimum": 0, "maximum": 60 },
        "operationCardNumber": { "type": ["string", "null"] }
      }
    },
    "otpVerification": {
      "type": "object",
      "required": ["otpCode", "verifiedAt"],
      "properties": {
        "otpCode": { "type": "string", "minLength": 6, "maxLength": 6 },
        "verifiedAt": { "type": "string", "format": "date-time" },
        "deviceIp": { "type": "string" }
      }
    }
  }
}
```

---

## 4. Consecuencias

### Positivas
- **Mayor tasa de conversión en la Landing:** Reducción drástica del número de campos obligatorios en el primer contacto (de 14 campos distribuidos en 4 pasos, a solo 7 campos en 3 pasos rápidos).
- **Mayor confianza del usuario:** La cuenta de desembolso no se solicita a ciegas, sino en un entorno autenticado con la oferta aprobada en mano.
- **Mejor calidad del dato financiero:** Al solicitar la cuenta de desembolso durante la formalización, el usuario está incentivado a suministrar el número exacto y verificar titularidad para recibir el dinero.

### Costos y Consideraciones
- `core` deberá habilitar o migrar su endpoint de ingesta web inicial para marcar los campos vehiculares como opcionales en el lead intake y crear el endpoint formal de aceptación de oferta (`/accept-offer`).
- Mientras se actualiza `core`, la landing inyecta valores de compatibilidad seguros en `core-lead.ts`.
- La interfaz de prestatario (`/s/[token]`, Stage 4) integrará los componentes visuales de captura de cuenta y taxi antes de detonar el modal OTP de firma.

---

## 5. Referencias

- `src/components/apply/FormSteps.tsx`
- `src/lib/application-schema.ts`
- `src/lib/core-lead.ts`
- `src/app/s/[token]/page.tsx`
- Credalia `core` WebLeadIntake & LoanOffer contracts
