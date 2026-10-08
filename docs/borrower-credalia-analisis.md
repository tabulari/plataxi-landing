# Análisis: proceso borrower de Credalia → implementación en Plataxi

> Solo análisis. No se implementó nada. Fecha: 2026-10-07.
> Repos inspeccionados: `/home/ale/Work/credalia` (workspace borrower real) y
> `/home/ale/Work/plataxi-landing` (landing que capta leads con simulador).

---

## 1. Journey borrower end-to-end en Credalia

### 1.0 Nota sobre "J1–J5"

No existe ningún enum, tabla o scope literal `J1…J5` en el código. Lo que sí existe:

- **7 `WorkflowScope`** (fuente de verdad): `shared/contracts/ephemeral_sessions.py` (`SCOPE_POLICY`, TTL y flags por scope).
- **Stepper visual de 5 etapas** en el workspace edge: `apps/edge/src/app/(borrower)/workspace-stepper.tsx`
  (Solicitud → Documentos → Evaluación → Oferta → Desembolso).
- **Journeys de QA** con nomenclatura `J-SOL-01…` (ej. `docs/implementation-plans/IP-096-*`, `QA-018`), que son
  casos de auditoría del backoffice, no etapas del borrower.
- **7 etapas mock** en Plataxi landing (`src/components/borrower/SevenStageStepper.tsx`): Solicitud, Identidad,
  Evaluación, Oferta, Firma OTP, Desembolso, Mi Crédito Activo.

Recomendación: si se quiere hablar de "J1–J5", mapearlo al stepper de 5 etapas del workspace real
(§1.6), no a los scopes (que son 7+1). Este documento usa los scopes como referencia precisa.

### 1.1 Etapa 0 — Intake (dos puertas de entrada)

| Canal | Endpoint Core | Workflow | Estado resultante |
|---|---|---|---|
| WhatsApp mock (dev/tests + piloto) | `POST /api/webhooks/whatsapp/mock` → `apps/core/src/api/webhooks/whatsapp.py` → `domain/intake/workflow.py::process_*` | Crea customer + `loan_application` (`application_draft`, `current_stage=intake`) y despacha sesión `COMPLETE_APPLICATION` | `application_draft` |
| Web Lead Intake (landing real, el que usa Plataxi) | `POST /api/v1/intake/web-lead` → `apps/core/src/api/intake.py::post_web_lead` → `domain/intake/web_lead_workflow.py::process_web_lead_intake` | Valida `WebLeadIntakeRequest` (`web_lead_schemas.py`: nombre, cédula, teléfono 10 dígitos, email, taxi_role, contacto de referencia, consentimiento Habeas Data + `consent_text_hash` SHA-256, snapshot de términos del simulador, modalidad de pago DOMAIN-009). Crea/actualiza draft, fija modalidad inmutable (`bind_payment_modality`), audita `APPLICATION_DRAFT_CREATED_FROM_LANDING_WEB` + `CONSENT_GRANTED`, despacha sesión `COMPLETE_APPLICATION` y **devuelve `workspace_url`** (`WebLeadIntakeResponse.radicado/application_id/customer_id/workspace_url`) | `application_draft` + link workspace |
| Plataxi hoy | `src/app/api/application/route.ts` → `src/lib/core-lead.ts::forwardApplicationToCore` (mapea formulario + términos del simulador a `WebLeadIntakeRequest`, IP-163) | Ya conectado al web-lead; recibe `workspace_url` pero el workspace local (`src/app/s/[token]/page.tsx`) es **mock estático** (datos quemados "Laura Martínez", stepper simulado con botones "Simular Aprobación") | lead radicado, sin workspace real |

Rango piloto vigente: `INTAKE_SUBMIT_MIN/MAX_AMOUNT_COP = 100.000–1.000.000` (`intake/borrower_queries.py`, alineado con `PLATAXI_MAX_AMOUNT_COP`).

### 1.2 Etapa 1 — Workspace link + completar/someter aplicación (scope `complete_application`, TTL 120 min, reusable)

- **Intercambio del link**: `GET /s/[token]` (`apps/edge/src/app/s/[token]/route.ts`): valida sesión (`validateWorkspaceSession`),
  resuelve destino con `lib/entry-path.ts::resolveEntryDestination` y fija cookies `WORKSPACE_SESSION_COOKIE` (httpOnly).
  Nunca borra la cookie ante un link stale (protege la pestaña viva del borrower).
- **Rutas borrower**: `apps/edge/src/app/(borrower)/` — `solicitud/page.tsx` (formulario monto+propósito),
  `page.tsx` (home), `layout.tsx` + `borrower-shell.tsx`, `data-loaders.ts`, `credit-view-state.ts`.
- **API Core** (`apps/core/src/api/borrower.py`, prefijo `/api/v1/borrower`):
  - `GET /application/current` → `intake/borrower_queries.py::get_borrower_application`
  - `PATCH /application/current` → `update_borrower_application` (draft editable; bloqueado tras submit)
  - `POST /application/current/submit` → `submit_borrower_application`: exige monto+propósito en rango,
    pasa a `application_submitted`, **consume la sesión** (`consume_session`, single-transition) y despacha la
    siguiente: `UPLOAD_KYC_DOCUMENTS` (el `next_session_token` vuelve en la respuesta).
- **Autorización**: por acción, no por rol: `require_borrower_action(BorrowerAction.*)` (`api/auth.py`) sobre
  `WorkflowScope ↔ BorrowerAction` (`shared/contracts/ephemeral_sessions.py`, `ACTION_POLICY`).

### 1.3 Etapa 2 — Documentos + KYC/liveness (scope `upload_kyc_documents`, TTL 60 min, reusable)

- **Documentos** (`documentos/page.tsx`, `document-upload-*.tsx`, `document-actions.tsx`):
  - `GET /application/current/documents` → `kyc/borrower_queries.py::get_borrower_documents`
  - `POST /application/current/documents` → `create_document_upload_intent` (presigned S3) + `POST .../{id}/confirm` →
    `confirm_document_upload` (valida objeto en storage; 409 si aún no llegó el PUT). Replace vía `POST .../{id}/replace`.
- **KYC identidad + liveness** (`verificacion/`: `verificacion-flow.tsx`, `identity-document-capture*.tsx`,
  `face-liveness-detector.tsx`, `attempt-limit.ts`, `under-review-card.tsx`; flag `enable_kyc_verification_attempts`):
  - `POST /application/current/kyc/capture-intent` → `POST /kyc/capture/{id}/confirm` (crea attempt server-owned)
  - `POST /kyc/liveness/session` → `POST /kyc/attempts/{id}/result` (Rekognition liveness + Textract, `attempt_api.py`)
  - `POST /kyc/submit-signals` → `submit_kyc_signals` → `pending_signals → under_review` (`signal_queries.py::advance_to_under_review`),
    app pasa a `kyc_under_review`. Solo admin puede `verified / rejected / needs_more_information`
    (`kyc/admin_queries.py` → `application_status = kyc_verified | kyc_rejected | needs_more_information`).
  - Estados `identity_verifications.kyc_status`: `not_started, pending_documents, pending_signals, under_review,
    needs_more_information, verified, rejected, expired` (`kyc/tables.py`).
  - El resolver `decideKycDestination` (`entry-path.ts`) manda a `/verificacion` solo en estados capturables;
    si la app aún está en draft/started o KYC expiró → `not_ready` (`/session-status`).
- Al verificarse KYC, el flujo despacha `REVIEW_OFFER` (`attempt_api.py` ≈ L1034, `kyc/admin_queries.py` ≈ L143).

### 1.4 Etapa 3 — Oferta (scope `review_offer`, TTL 30 min; ver reusable, decisión consume)

- **UI**: `oferta/page.tsx` + `offer-decision-section.tsx` + `DriverProfileForm.tsx` (corrige nombre/cédula y captura
  perfil conductor: dirección, ciudad, cuenta bancaria — banco va a columnas cifradas, metadata queda `***`; IP-202).
- **API**:
  - `GET /application/current/offer` → `offers/borrower_queries.py::get_current_loan_offer`
    (`generated → viewed` al leer; calcula `installment_amount_cop` + campos de modalidad DOMAIN-009).
  - `POST /application/current/offer/{id}/decision` → `submit_offer_decision`: valida vigencia (`expires_at`),
    `accepted → contract_pending/contract_status=pending/current_stage=contract` + sella `driver_profile` en metadata +
    audita `OFFER_ACCEPTED` + `CONTRACT_GENERATED` (prototipo), consume sesión `REVIEW_OFFER` y crea sesión
    `ACCEPT_CONTRACT` (`create_contract_acceptance_session`). `rejected → rejected_by_borrower`.
- Emisor: `offers/admin_queries.py` (≈ L434) despacha `REVIEW_OFFER` al generar la oferta (el admin dispara el link "oferta lista").

### 1.5 Etapa 4 — Contrato/pagaré con OTP (scope `accept_contract`, TTL 15 min, **single-use**, NO piloto)

- **UI**: `contract/page.tsx` + `otp-countdown.tsx`.
- **Flujo OTP por WhatsApp (único canal OTP)**: `contracts/borrower_queries.py::_OTP_DELIVERY_CHANNEL = WHATSAPP_TWILIO`
  (IP-210 T6: "un OTP de contrato viaja en el trust-model del teléfono; no es elegible para email").
  - `POST /application/current/contract/request-otp` → `request_contract_otp`: valida contexto
    (`contract_pending + pending + offer accepted + KYC verified + risk approved + no expirada`), emite OTP en Redis +
    encola outbox `SEND_CONTRACT_OTP` (202 Accepted; 409 si ya emitido, 423 si bloqueado, 422 si el contrato ya no es pendiente).
  - `POST /application/current/contract/accept` → `accept_borrower_contract`: verifica OTP, arma paquete de firma del
    pagaré (`promissory_note.build_promissory_note_signature_package`: hash de spec, manifiesto, base legal),
    transiciona atómicamente a `contract_signed/signed`, consume la sesión (single-use) y audita `CONTRACT_SIGNED`
    (con `otp_proof`, `promissory_note.*`, consentimientos). Limpieza del OTP best-effort post-commit.
  - `GET /application/current/contract` → `get_borrower_contract` (términos + `contract_version = prototype-v1:sha256(...)`).
- **Desambiguación importante**: el link `accept_contract` se emite por WhatsApp pero el **código OTP** viaja por
  WhatsApp a `primary_phone` cifrado; son dos envíos distintos (link vs código).

### 1.6 Etapa 5 — Desembolso (scopes de lectura `view_disbursement_status` / `view_repayment_schedule`, TTL 60 min)

- El desembolso lo ejecuta el **admin/backoffice** (`disbursements/admin_queries.py`: manual disbursement + schedule;
  ≈ L673/L892 despachan sesiones de lectura al borrower). El borrower solo **observa**:
  - `GET /applications/{id}/disbursement-status` → `disbursements/borrower_queries.py::get_borrower_disbursement_status`
    (proyección segura: `status ∈ {disbursement_pending, disbursed, repayment_active, closed}` + `schedule_available`).
  - **UI**: `mi-credito/page.tsx` + `credit-view-state.ts::getCreditViewState` (`pending | confirmed | schedule_unavailable`)
    + `payment-schedule.tsx`; `nonKycEntryPath` manda ambos scopes a `/mi-credito`; `contactability-card.tsx` (IP-206).
- Estados app: `disbursement_pending → disbursed → repayment_active → closed`.

### 1.7 Etapa 6 — Pagos (scope `view_repayment_schedule`; `SUBMIT_PAYMENT` vive bajo ese scope, repeatable, no consume)

- `GET /applications/{id}/repayments` → `get_borrower_repayment_schedule` (cuotas ordenadas).
- `POST /applications/{id}/payments/submit` → `submit_payment_proof` (solo en `disbursed/repayment_active`; idempotente por
  `external_reference` único; estado `PENDING_CONFIRMATION`; audita `PAYMENT_PROOF_SUBMITTED`). UI: `comprobantes/page.tsx`,
  `payment-proof-form.tsx`.
- `GET .../payments` (historial envíos), `GET .../closed-history` (scope `view_closed_loan_history`: solo `closed`; paliativo
  `pilot_issuance_authorized=False`, como `accept_contract`).
- La confirmación es del admin/operador; el borrower ve el estado en `/mi-credito`. Cobranza lee vía workstation
  (`privacy/purpose_registry.py`, `collections.py::COBRANZA_READER`) — **no hay recordatorios automáticos al borrower
  en el código actual** (hallazgo: hueco a cerrar en Plataxi, §2.7).

### 1.8 Máquina de estados (resumen)

```text
application_draft → application_started → application_submitted → kyc_under_review
  → { kyc_verified | needs_more_information ↺ | kyc_rejected ✕ }
  → offer (generated → viewed → accepted | rejected_by_borrower | expired)
  → contract_pending → contract_signed → disbursement_pending → disbursed
  → repayment_active → closed
```

Cada flecha borrower-iniciada consume su sesión efímera y el servidor despacha la siguiente; el link que recibe el
borrower **es** la autorización (sin passwords). TTLs: complete 120′ · kyc 60′ · oferta 30′ · contrato 15′ (single-use) ·
lecturas 60′.

---

## 2. Touchpoints donde el borrower necesita comunicación

| # | Touchpoint | Disparador (emisor) | Canal actual en Credalia | Destino link | Criticidad |
|---|---|---|---|---|---|
| T1 | **Link workspace inicial** (completar solicitud) | `process_web_lead_intake` / intake WhatsApp → `dispatch_workflow_session(COMPLETE_APPLICATION)` → outbox `SEND_EPHEMERAL_LINK` | WhatsApp (Twilio; mock en dev) o **email si hay `email_enc` + `EMAIL_DISPATCH_ENABLED`** (routing ADR-0080 §3.6, `_channel_from_policy`) | `/solicitud` | Alta — sin esto el lead muere en el simulador |
| T2 | **Submit → piden documentos/KYC** | `submit_borrower_application` → `dispatch(UPLOAD_KYC_DOCUMENTS)` | Mismo outbox; el token vuelve además inline (`next_session_token`) si el usuario sigue en pantalla | `/verificacion` o `/solicitud` (según `decideKycDestination`) | Alta |
| T3 | **`needs_more_information` / rechazado KYC** | Decisión admin (`kyc/admin_queries.py`) → `dispatch` nueva sesión KYC | Mismo mecanismo (link nuevo). La UI muestra `borrower_reason_code/message` (`borrower_reasons.py`) | `/verificacion` | Alta — principal causa de abandono silencioso si no se avisa |
| T4 | **Oferta lista** | Admin genera oferta (`offers/admin_queries.py` → `dispatch(REVIEW_OFFER)`) | WhatsApp/email según política | `/oferta` (TTL 30′) | Muy alta — la oferta **expira** (`expires_at`); avisar tarde = oferta muerta |
| T5 | **Oferta por vencer / vencida** | ⚠️ **No existe job/recordatorio** (solo validación al decidir: "Loan offer has expired") | — | — | Hueco: implementar recordatorio T-24h/T-2h |
| T6 | **Link + código OTP de contrato** | Acepta oferta → `create_contract_acceptance_session` (link); `request_contract_otp` → outbox `SEND_CONTRACT_OTP` (código) | Link: WhatsApp. **Código: solo WhatsApp** (nunca email, IP-210 T6) | `/contrato` (single-use, 15′) | Muy alta — ventana de 15 min exige entrega inmediata y reintento visible (`otp-countdown.tsx`) |
| T7 | **Contrato firmado → desembolso pendiente/realizado** | Transición `CONTRACT_SIGNED`; desembolso manual admin (`disbursements/admin_queries.py` → `dispatch` lecturas) | Link de lectura por WhatsApp/email | `/mi-credito` (`pending → confirmed`) | Alta — ansiedad post-firma; confirmar giro reduce tickets a soporte |
| T8 | **Recordatorios de pago** | ⚠️ **No existe emisor periódico** (solo `payment-schedule.tsx` pasivo + cobranza manual vía workstation) | — | `/mi-credito`, `/comprobantes` | Hueco: vencimiento próximo, mora, comprobante observado/rechazado |
| T9 | **Soporte / sesión inválida** | Scope `contact_support` → `/soporte`; `/session-status?status=` (expired/invalid/unavailable) + `workspace-unavailable-panel.tsx` | Link de soporte; dentro del workspace `whatsapp-help-card.tsx` | `/soporte` | Media — red de seguridad anti-abandono |
| T10 | **Historial / crédito cerrado** | `dispatch(VIEW_CLOSED_LOAN_HISTORY)` (piloto no autorizado; post-cierre) | Email elegible a futuro (Tier 1 cuando ADR-0060 lo libere) | `/mi-credito` | Baja (post-cierre, fidelización) |

Reglas transversales que condicionan el diseño: **un canal por evento, sin fallback automático v1 salvo
WhatsApp→SMS en agotamiento** (worker `outbox.py::_WHATSAPP_CHANNELS` + fallback `dispatch_sms`, IP-048);
reintento admin **repite el canal original de la sesión** (`ephemeral_sessions/admin_operations.py`);
`accept_contract` nunca por email; expiración/revocación nunca borra la cookie de una pestaña viva.

---

## 3. Evaluación para Plataxi: hyperframes vs email vs SMS/WhatsApp

### 3.0 Aclaración de categoría (importante)

**Hyperframes no es un canal de notificación.** En este ecosistema `hyperframes` es una skill de composición de
video/HTML (títulos, overlays, captions, TTS, transiciones — ver `.atl/skill-registry.md` en Credalia) para
**producir piezas de contenido**, no para entregarlas. La comparativa correcta es:

- **Piezas** (qué se muestra): video/HTML Hyperframes embebido o enlazado (ej. "cómo firmar tu contrato en 40 seg").
- **Canales** (cómo llega): email (Resend) vs SMS/WhatsApp (Twilio). Credalia hoy: **WhatsApp-primero + email donde
  hay dirección verificada**; SMS solo como fallback de agotamiento WhatsApp.

### 3.1 Qué usa Credalia hoy (reutilizable tal cual)

| Pieza | Estado | Reutilización en Plataxi |
|---|---|---|
| Outbox durable `SEND_EPHEMERAL_LINK` + `SEND_CONTRACT_OTP` + `SEND_CATEGORY_B_REPLY` (`workers/src/tasks/outbox.py`, `notifications.py`) con claim `dispatch_token`, reconciliación Twilio y DLQ | Productivo | ✅ Reutilizar 100 %: es el bus de entrega de links y OTP |
| WhatsApp Twilio real (`dispatch_whatsapp_twilio`) + `whatsapp_cloud` **mock-only** (prohibido llamar a Meta Graph API, IP-021 AC-9) + `whatsapp_mock/mock` éxito simulado | Productivo/mock | ✅ Usar Twilio; cloud sigue mock |
| Email vía Resend (`workers/src/tasks/email_delivery.py`, tags `outbox_event_id+dispatch_token`, idempotencia) + routing por scope Tier 0/1 (ADR-0080 §3.6, `email_authorized` en `SCOPE_POLICY`) | En despliegue por fases (T7 pendiente en worker) | ✅ Reutilizar; verificar flag `EMAIL_DISPATCH_ENABLED`/`workflow_session_link_dispatch_enabled` en el env de Plataxi |
| SMS Twilio (`dispatch_sms`) como fallback + demo trial | Productivo | ✅ Reutilizar como red de seguridad (T6 OTP: evaluar si el trust-model admite SMS fallback o debe quedarse WhatsApp-only) |
| Habeas Data consent (`client_ip, user_agent, consent_text_hash`, `CONSENT_GRANTED`) | Productivo | ✅ Obligatorio para Ley 1581 en cada lead (Plataxi ya lo envía vía `core-lead.ts`) |
| Vocabulario `shared/constants/channels.py` (`EPHEMERAL_LINK_CHANNELS={whatsapp_twilio,email}`, `TWILIO_CHANNELS`, `MOCK_CHANNELS`) + guards de gobernanza | Productivo | ✅ No inventar literales nuevos |

### 3.2 Comparativa para el público Plataxi (taxistas, mobile-first, WhatsApp ya en uso)

| Dimensión | WhatsApp (Twilio) — recomendado como primario | Email (Resend) — recomendado como secundario | SMS — solo fallback | Hyperframes (piezas, no canal) |
|---|---|---|---|---|
| Alcance en taxistas | Máximo: ya es el canal de contacto (`whatsappPhone`, `WhatsAppLink`, mockup de chat en la landing) | Medio-bajo: el intake lo pide pero muchos no lo revisan a diario | Alto (todo celular lo recibe) | N/A (se distribuye *por* los anteriores) |
| Entregabilidad Colombia | Alta, pero atada a plantillas/opt-in y número Twilio | Buena; riesgo de spam/gmail-promos; exige dirección verificada (Tier 0/1) | Muy alta; sin plantillas | N/A |
| Costo | Por conversación/plantilla Meta+Twilio; el más caro a escala | Barato por millar (Resend) | Por segmento; intermedio, caro para links largos | Costo de producción (una vez) + hosting; marginal por vista |
| Urgencia (OTP 15′, oferta 30′) | ✅ Inmediato + push + ticks de lectura | ❌ No sirve para OTP (prohibido por trust-model) ni ventanas cortas | ✅ Aceptable como fallback del OTP/links | ❌ No es tiempo real |
| Contenido rico / pedagogía | Limitado (texto+botones+links) | ✅ HTML completo | ❌ 160 chars | ✅ Ideal: videos 30–60 s ("qué es el pagaré", "cómo tomar la foto de la cédula", "cómo subir tu comprobante") enlazados desde WhatsApp/email/workspace |
| Trazabilidad | SIDs Twilio + reconciliador + callback `/twilio/status` | IDs Resend + tags outbox | SIDs Twilio | Vistas del video (métrica de producto, no de entrega) |
| Fricción mobile-first | Cero: abre el chat que ya usan | Media: salir al mail, login | Cero, pero sin contexto visual | Cero si es link con preview y <60 s |
| Riesgo | Plantillas Meta, baneo por spam, costo | Spoofing/phishing si no se firma (SPF/DKIM, dominio propio) | Smishing, costo por segmento | Peso/datos móviles; accesibilidad (subtítulos obligatorios) |

### 3.3 Recomendación

1. **Primario: WhatsApp Twilio** para T1–T4, T6–T7 (links + OTP). Es donde ya vive el taxista y el único canal
   válido para el OTP de contrato. Mantener el fallback WhatsApp→SMS del worker.
2. **Secundario: email Resend** para T1–T4, T7 (resumen con link + radicado) y T10; nunca para OTP. Requiere
   `email_enc` verificado y flags de ADR-0080 activos.
3. **Hyperframes como capa de contenido, no de entrega**: 3–4 piezas cortas enlazadas desde los mensajes y
   embebidas en el workspace (`/verificacion`, `/contrato`, `/comprobantes`): (a) cómo completar la solicitud,
   (b) foto de cédula + liveness sin fallar, (c) qué estás firmando (pagaré/OTP en 40 s), (d) cómo subir el
   comprobante de pago. Cada mensaje WhatsApp/email lleva el link profundo correspondiente.
4. **Cerrar los dos huecos antes de escalar**: recordatorio de oferta por vencer (T5) y recordatorios de pago
   (T8) como nuevos emisores outbox (misma planta: `dispatch_workflow_session` + evento + worker), no como sistema aparte.
5. **No construir**: ni un centro de notificaciones propio en la landing, ni envío directo Meta Cloud (mock-only por
   política), ni email para OTP, ni literales de canal nuevos (usar `shared/constants/channels.py`).

---

## 4. Next steps (solo enunciados, sin implementar)

1. **NS-1 — Workspace real en Plataxi**: reemplazar el mock `src/app/s/[token]/page.tsx` (datos quemados + botones
   "Simular") por consumo del workspace edge/Core (`workspace_url` que ya devuelve el web-lead) o proxy hacia él;
   mapear `SevenStageStepper` (7) al stepper real (5) + `/mi-credito` + `/comprobantes`.
2. **NS-2 — Verificar flags de entrega**: `EMAIL_DISPATCH_ENABLED`, `workflow_session_link_dispatch_enabled`,
   credenciales Twilio/Resend en el env de Plataxi; probar T1 punta a punta con un lead staging.
3. **NS-3 — T5 oferta por vencer**: job que a T-24h/T-2h de `offers.expires_at` re-despache `REVIEW_OFFER`
   (respetando `reusable`+TTL y canal original de la sesión); copiar patrón `disbursements/admin_queries.py`.
4. **NS-4 — T8 recordatorios de pago**: emisor sobre `repayment_installments` (próximo vencimiento, mora,
   comprobante observado) reutilizando outbox + `VIEW_REPAYMENT_SCHEDULE`; definir plantillas y frecuencia con cobranza.
5. **NS-5 — Piezas Hyperframes**: producir (a)–(d) (§3.3.3) con subtítulos y <60 s; enlazarlas en plantillas
   WhatsApp, emails y pantallas del workspace; medir vista→conversión por etapa.
6. **NS-6 — Decisión OTP/SMS**: con riesgo/seguridad, dictaminar si `SEND_CONTRACT_OTP` admite fallback SMS
   o permanece WhatsApp-only (hoy el código lo fija a `WHATSAPP_TWILIO`).
7. **NS-7 — Observabilidad de entrega**: exponer `admin_system.py::list_outbox_events` (o réplica) al operador
   Plataxi: links enviados, entregados, expirados y reintentos por radicado.
8. **NS-8 — Endurecer re-entrada**: replicar `resolveEntryDestination` + `/session-status` + "no borrar cookie viva"
   en cualquier front propio que viva frente al workspace.

---

### Archivos y endpoints clave (índice rápido)

- Scopes/autorización: `credalia/shared/contracts/ephemeral_sessions.py`, `shared/constants/channels.py`
- Sesiones: `credalia/apps/core/src/domain/ephemeral_sessions/service.py`, `admin_operations.py`
- Intake: `apps/core/src/api/intake.py`, `domain/intake/web_lead_workflow.py`, `web_lead_schemas.py`,
  `domain/intake/workflow.py`, `api/webhooks/whatsapp.py`
- Borrower API: `apps/core/src/api/borrower.py` (§1.2–1.7 para el mapa endpoint↔query)
- Oferta/contrato/desembolso/pagos: `domain/offers/borrower_queries.py`, `domain/contracts/borrower_queries.py` (+`otp.py`,
  `promissory_note.py`), `domain/disbursements/{borrower,admin}_queries.py`, `domain/repayments/borrower_queries.py`
- KYC: `domain/kyc/{borrower_queries,attempt_api,signal_queries,state_machine,admin_queries}.py`
- Workspace edge: `apps/edge/src/app/s/[token]/route.ts`, `lib/entry-path.ts`, `app/(borrower)/{solicitud,documentos,
  verificacion,oferta,contract,mi-credito,comprobantes,soporte}/`, `workspace-stepper.tsx`, `credit-view-state.ts`
- Workers: `apps/workers/src/tasks/{outbox,notifications,email_delivery}.py`
- Plataxi: `src/lib/core-lead.ts`, `src/app/api/application/route.ts`, `src/app/s/[token]/page.tsx`,
  `src/components/borrower/{SevenStageStepper,OtpContractModal,KycDocumentStation}.tsx`, `src/lib/config.ts`
