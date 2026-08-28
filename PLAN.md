# Credalia — Project Plan

Living document. Check off items as they're completed. Add new items as they arise.
Phases are ordered by priority; items within each phase are roughly ordered by effort (quickest first).

---

## Phase 1 — White-Label Client Onboarding

> These items are **by design** placeholders. Credalia is a white-label product —
> the abstraction layer exists so that real client data is plugged in via env vars
> with zero code changes. Mark complete when a real client provides values.

- [x] 1.1 Wire real application backend endpoint (`APPLICATION_ENDPOINT`) — env var mechanism in place, API route uses `config.applicationEndpoint`
- [x] 1.2 Configure real company NIT (`NEXT_PUBLIC_COMPANY_NIT`) — env-driven via `config.company.nit`
- [x] 1.3 Configure real registered address (`NEXT_PUBLIC_COMPANY_ADDRESS`) — env-driven via `config.company.address`
- [x] 1.4 Configure real WhatsApp Business line (`NEXT_PUBLIC_WHATSAPP_PHONE`) — env-driven via `config.whatsappPhone`
- [x] 1.5 Configure real contact phone (`NEXT_PUBLIC_CONTACT_PHONE`) — env-driven via `config.company.contactPhone`
- [x] 1.6 Configure real social media URLs — env-driven via `config.social.*`
- [x] 1.7 Replace placeholder interest rate in `credit.ts` with configurable pricing
  - [x] 1.7.1 Make `MONTHLY_RATE` configurable via env var `NEXT_PUBLIC_CREDIT_MONTHLY_RATE` (interim — will come from Credalia dashboard API)
  - [x] 1.7.2 Replace hardcoded `validateApplication` thresholds with configurable rules via `NEXT_PUBLIC_CREDIT_SMALL_AMOUNT_THRESHOLD`, `NEXT_PUBLIC_CREDIT_SMALL_AMOUNT_MAX_TERM`, `NEXT_PUBLIC_CREDIT_HIGH_AMOUNT_THRESHOLD`, `NEXT_PUBLIC_CREDIT_HIGH_AMOUNT_MIN_TERM` (interim — will come from Credalia dashboard API)
  - [x] 1.7.3 Add runtime warning if placeholder rate is detected in production
  - [ ] 1.7.4 Wire to real rate engine when available (currently placeholder amortization formula)
- [x] 1.8 Confirm regulator status (`NEXT_PUBLIC_REGULATOR_VERIFIED`) — env-driven, gates regulator claims
- [ ] 1.9 Finalize legal copy for Terms & Conditions page
- [ ] 1.10 Finalize legal copy for Privacy Policy page
- [ ] 1.11 Finalize legal copy for Security Policy page
- [x] 1.12 Confirm/replace real company legal name — env-driven via `NEXT_PUBLIC_COMPANY_LEGAL_NAME`

### Phase 1+ — Extended White-Label Configuration

- [x] 1.13 Brand display name configurable via `NEXT_PUBLIC_BRAND_NAME` — replaced all hardcoded "Credalia" strings in Nav, Footer, PhoneChat, WhatsApp messages, legal pages, layout metadata, manifest, JSON-LD
- [x] 1.14 Contact email + hours configurable via `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_HOURS` — Footer uses `config.contactEmail` / `config.contactHours`
- [x] 1.15 Regulator name configurable via `NEXT_PUBLIC_REGULATOR_NAME` / `NEXT_PUBLIC_REGULATOR_SHORT_NAME` — Hero, Security, Footer use config
- [x] ~~1.16 Radicado prefix configurable via `NEXT_PUBLIC_RADICADO_PREFIX`~~ — **superseded by T10** (see Phase 1++ below): Core now generates the radicado, so this env var/config field was removed as dead code (nothing consumed it after the API route stopped building radicados locally).
- [x] 1.17 Simulator parameters configurable via env vars:
  - [x] `NEXT_PUBLIC_SIM_AMOUNT_MIN`, `NEXT_PUBLIC_SIM_AMOUNT_MAX`, `NEXT_PUBLIC_SIM_AMOUNT_STEP`, `NEXT_PUBLIC_SIM_AMOUNT_STEP_BIG`
  - [x] `NEXT_PUBLIC_SIM_DEFAULT_AMOUNT`, `NEXT_PUBLIC_SIM_DEFAULT_TERM`
  - [x] `NEXT_PUBLIC_SIM_TERM_OPTIONS` (comma-separated)
  - [x] Slider labels derived from config (no more hardcoded $50.000 / $1.000.000)
  - [x] Max amount in marketing copy (Hero, metadata, manifest, JSON-LD) derived from `config.simulator.amountMax`
- [x] 1.18 Bank list configurable via `NEXT_PUBLIC_APPLICATION_BANKS` (comma-separated)
- [x] 1.19 Employment types configurable via `NEXT_PUBLIC_APPLICATION_EMPLOYMENT_TYPES` (comma-separated)
- [x] 1.20 Brand colors configurable via `NEXT_PUBLIC_COLOR_NAVY`, `NEXT_PUBLIC_COLOR_ORANGE`, `NEXT_PUBLIC_COLOR_GREEN` — used in manifest theme-color, layout viewport, not-found page, JSON-LD
- [x] 1.21 GTM/GA4 container ID configurable via `NEXT_PUBLIC_GTM_ID` — layout loads GTM script when set

### Phase 1++ — Core Integration (IP-028, cross-repo with credalia-core)

> credalia-landing consumes two credalia-core contracts. This repo can't govern
> or force the merge of the Core-side work (T1/T4 there) — only implement and
> describe its own side.

- [x] T10 — Wire lead submission to Core's `POST /api/v1/intake/web-lead`
  - [x] `app/api/application/route.ts` forwards the validated lead server-side (never from the browser), auth'd via `X-Landing-Api-Key` (`LANDING_API_KEY` env var)
  - [x] Local radicado generation removed — the route returns Core's `radicado` (see 1.16 above)
  - [x] `clientIp`, `userAgent`, `consentTextHash` (new `src/lib/consent.ts`) sent for Habeas Data audit traceability
  - [x] Fixed `terms` shape mismatch — client sends the internal `Simulation` object (`term`/`monthlyRate`); route now maps to Core's expected `{ amount, termMonths, monthlyInterestRate }` before forwarding
  - [x] Fixed `phone` — UI allows spaces while typing (e.g. "300 123 4567"); route now strips to exactly 10 digits before forwarding (Core requires exact length)
  - [x] Verified end-to-end against a real local Core instance (`:8000`) — got back a real radicado (`CR-2026-XXXXXXXX`)
- [x] T11 — Live rates from Core's `GET /api/v1/sessions/rates-config`
  - [x] `simulator-store.tsx` fetches on mount, falls back silently to static `config.credit`/`config.simulator` defaults on failure (acceptance criterion — verified the page doesn't break with Core down)
  - [x] Core's `monthly_interest_rate`, `min_amount`, `max_amount`, and `term_options_months` become the reactive simulator configuration after strict validation. The four local small/high-amount eligibility thresholds remain static until Core exposes equivalents.
  - [x] CORS on Core's `rates-config` — was blocking the browser fetch (confirmed via curl: missing `Access-Control-Allow-Origin`); fixed on the credalia-core side, re-verified `access-control-allow-origin: http://localhost:3027` present and the client bundle now inlines the real `NEXT_PUBLIC_RATES_CONFIG_ENDPOINT` instead of the placeholder
- [x] Fixed a latent bug found while implementing T11: `config.ts`'s `read*()` helpers used dynamic `process.env[key]` lookups, which Next.js's client-bundle compiler can't statically inline (`NEXT_PUBLIC_*` inlining only works on literal `process.env.NEXT_PUBLIC_X` expressions). Every `NEXT_PUBLIC_*` value read inside client-only code (event handlers, `useEffect`, post-hydration state) was silently falling back to its default instead of the real env value — invisible until now because defaults matched `.env.example` by convention. Rewrote the helpers to take the pre-resolved value so every call site does the literal access.

---

## Phase 2 — Performance

- [x] 2.1 Lazy-load heavy client components
  - [x] 2.1.1 Dynamic-import `ApplyModal` (ssr: false, only renders on interaction)
  - [x] 2.1.2 Dynamic-import `StickyPaymentBar` (ssr: false)
  - [x] 2.1.3 Dynamic-import `ResumeNudge` (ssr: false)
  - [x] 2.1.4 Lazy-load PhoneChat CSS — extracted to `src/components/phone-chat.css`, imported only by PhoneChat (code-split via Next.js CSS imports)
- [x] 2.2 Remove unused `next-themes` dependency — **kept**: used by `src/components/ui/sonner.tsx` (Toaster). Will be needed for dark mode roadmap item.
- [x] 2.3 Remove unused `@base-ui/react` dependency — **kept**: used by ShadCN UI primitives (`accordion.tsx`, `select.tsx`, `slider.tsx`).
- [x] 2.4 WebP for `og-image.png` — converted to `og-image.webp` (37 KB vs 588 KB PNG, 94% reduction); OG metadata lists WebP first with PNG fallback; Twitter card includes both

---

## Phase 3 — Accessibility

### Landmarks & Structure

- [x] 3.1 Add `<main>` landmark — wrap primary content in `<main>` in `page.tsx` (currently only `<header>` + `<footer>` exist as landmarks)
- [x] 3.2 Add `aria-labelledby` to all `<section>` landmarks
  - [x] 3.2.1 Hero section — add `id` to `<h1>` and `aria-labelledby` to `<section>`
  - [x] 3.2.2 SimulateSection — add `id` to `<h2>` and `aria-labelledby` to `<section>`
  - [x] 3.2.3 Requirements — add `id` to `<h2>` and `aria-labelledby` to `<section>`
  - [x] 3.2.4 HowItWorks — add `id` to `<h2>` and `aria-labelledby` to `<section>`
  - [x] 3.2.5 FAQ — add `id` to `<h2>` and `aria-labelledby` to `<section>`
  - [x] 3.2.6 Security — add `id` to `<h2>` and `aria-labelledby` to `<section>` (section itself rebuilt in look-and-feel pass: `src/components/Security.tsx`, wired into `page.tsx` between HowItWorks and FAQ, `#seguridad` nav link restored)
  - [x] 3.2.7 CtaBanner — add `id` to heading and `aria-labelledby` to `<section>`
- [x] 3.3 Fix skip link target — add `tabindex="-1"` to `#simula` section so focus moves on skip-link activation
  - [x] 3.3.1 Add `tabindex={-1}` to SimulateSection `<section>`
  - [x] 3.3.2 Add CSS rule `#simula:focus { outline: none; }` to suppress visible outline for programmatic focus

### Keyboard Navigation

- [x] 3.4 Mobile nav: auto-focus first link when hamburger menu opens
- [x] 3.5 Mobile nav: close on Escape key and return focus to toggle button

### Screen Reader Announcements

- [x] 3.6 Add `aria-live="polite"` region for dynamic simulator payment results
  - [x] 3.6.1 Add visually-hidden live region announcing "Cuota estimada: $X /mes" when simulator values change
  - [x] 3.6.2 Add `aria-live` to StickyPaymentBar payment display (sr-only polite region announcing payment + amount + term) payment display
- [x] 3.7 Add `role="alert"` to ApplyModal form error messages (field errors and consent error)
- [x] 3.8 Add `role="status"` + `aria-live="polite"` to ResumeNudge toast notification

### Focus Management

- [x] 3.9 ApplyModal: move focus to success/error heading when `submitStatus` transitions
- [x] 3.10 ApplyModal: strengthen focus trap — handle case where `document.activeElement` is outside the modal
- [x] 3.11 Add `aria-label="Resumen de simulación"` to ApplyModal sidebar `<aside>`

### Color Contrast

- [x] 3.12 Fix `text-white/40` on `bg-navy-deep` in ApplyModal sidebar (~3.68:1, fails WCAG AA) — increase to at least `text-white/50`

### Semantic HTML

- [x] 3.13 Replace `<em>` with `<span>` for error messages in ApplyModal (semantically inappropriate — `<em>` means stress emphasis, not advisory text)
- [x] 3.14 Fix CtaBanner heading level — change `<h3>` to `<h2>` (heading level skip in flat outline)
- [x] 3.15 Add `aria-labelledby` to footer social links group

### ARIA Attributes

- [x] 3.16 Add `aria-hidden="true"` to ChipRadioGroup check icon SVGs (redundant with `aria-checked` on `role="radio"`)
- [x] 3.17 Add explicit `aria-valuenow={amount}` to simulator slider (WAI-ARIA spec recommends alongside `aria-valuetext`)
- [x] 3.18 Add shared accessible label to FAQ accordion pair (two separate `<Accordion>` components need grouping)
- [x] 3.19 Hide arrow characters (→) in CTA buttons with `<span aria-hidden="true">`
  - [x] 3.19.1 Hero: "Simular mi crédito →", "Solicitar crédito →"
  - [x] 3.19.2 Simulator: "Solicitar este crédito →"
  - [x] 3.19.3 CtaBanner: "Simular mi crédito →", "Solicitar crédito →"
  - [x] 3.19.4 ApplyModal: "Enviar solicitud →", "Continuar →", "Reintentar envío →"
  - [x] 3.19.5 ResumeNudge: "Volver a tu solicitud →"

---

## Phase 4 — Security

- [x] 4.1 Add rate limiting to `/api/application` (5 req/min per IP, with map cleanup)
- [x] 4.2 Add origin / CORS check on API route
- [x] 4.3 Add CSRF protection (Origin + Referer header check)
- [x] 4.4 Protect PII in localStorage drafts
  - [x] 4.4.1 Base64-encode draft data at rest via `src/lib/draft-storage.ts` (light obfuscation — not encryption but prevents casual snooping)
  - [x] 4.4.2 Add user-visible notice about local data storage in consent step

---

## Phase 5 — Code Quality

- [x] 5.1 Decompose `ApplyModal` (494 lines → 5 files)
  - [x] 5.1.1 Extract `useApplicationForm` hook → `src/components/apply/use-application-form.ts`
  - [x] 5.1.2 Extract `useDraftPersistence` hook → `src/lib/draft-storage.ts` (standalone, not React hook — appropriate for non-reactive reads)
  - [x] 5.1.3 Extract `<ApplicationFormStep1>` sub-component → `src/components/apply/FormSteps.tsx`
  - [x] 5.1.4 Extract `<ApplicationFormStep2>` sub-component → `src/components/apply/FormSteps.tsx`
  - [x] 5.1.5 Extract `<ApplicationReviewStep>` sub-component → `src/components/apply/FormSteps.tsx`
  - [x] 5.1.6 Extract `<ApplicationSuccess>` sub-component → `src/components/apply/ResultPanels.tsx`
  - [x] 5.1.7 Extract `<ApplicationError>` sub-component → `src/components/apply/ResultPanels.tsx`
  - [x] 5.1.8 Extract `<ModalSidebar>` sub-component → `src/components/apply/ModalSidebar.tsx`
- [x] 5.2 Decompose `Simulator` (349 lines → sub-components)
  - [x] 5.2.1 Extract `<AmountInput>` (input + stepper + slider) → `src/components/simulator/AmountInput.tsx`
  - [x] 5.2.2 Extract `<SimulationResults>` (payment display + detail grid) → `src/components/simulator/SimulationResults.tsx`
  - [x] 5.2.3 Extract `<ReassuranceChips>` sub-component → `src/components/simulator/ReassuranceChips.tsx`
- [x] 5.3 Extract shared icon components → `src/components/icons/index.tsx`
  - [x] 5.3.1 Create `src/components/icons/` directory with icon components (25 icon components)
  - [x] 5.3.2 Replace inline shield+check SVGs (Hero, Simulator, Security, SimulateSection, ReassuranceChips) → `ShieldCheckIcon`
  - [x] 5.3.3 Replace inline lock SVGs (Hero, SimulateSection) → `LockIcon`/`LockKeyholeIcon`
  - [x] 5.3.4 Replace inline document SVGs (Security, Requirements) → `DocumentIcon`/`DocumentCheckIcon`
  - [x] 5.3.5 Replace other repeated SVGs → `CalendarIcon`, `ClockIcon`, `HelpIcon`, `CheckIcon`, `CloseIcon`, `PencilIcon`, `LightningIcon`, `HomeIcon`, `SearchCheckIcon`, `VerifiedCircleIcon`, `CredaliaLogo`, `MinusIcon`, `PlusIcon`, `HamburgerIcon`, `PersonIcon`, `IdCardIcon`, `CreditCardIcon`, `CalculatorIcon`, `DocUploadIcon`, `RefreshCheckIcon`, `BankIcon`, `AlertCircleIcon`, `ReturnArrowIcon`
- [x] 5.4 Replace magic color values with Tailwind/CSS variable tokens
  - [x] 5.4.1 Replace `#157347`, `#cdeede` in Simulator reassurance chips → `green-ink`/`green-tint`
  - [x] 5.4.2 Replace `#f2691c` in Hero chevron SVG → `var(--orange)`
  - [x] 5.4.3 Audit all remaining hardcoded hex colors across components → replaced `#1e9e55`→`var(--green)`/`text-green`, `#0d2a5e`→`var(--navy)`, `#f5601b`→`var(--orange)`, `#0b0d12`→`var(--navy-ink)`, `#3ddc97`→`var(--green-soft-ink)`, `#5d6b82`→`var(--muted-2,...)`, `#e0e6ef`/`#e6ebf2`/`#eef1f6`→`var(--border)` (concentric rings); only `#fff` remain (correct for white stroke/fill on colored backgrounds)
- [x] 5.5 Debounce `StickyPaymentBar` scroll listener fallback

---

## Phase 6 — SEO & Polish

- [x] 6.1 Add explicit `robots` metadata to landing page
- [x] 6.2 Make OG `url` absolute instead of relative
- [x] 6.3 Add `sitemap.xml` (Next.js App Router `app/sitemap.ts`)
- [x] 6.4 Add `robots.txt` (Next.js App Router `app/robots.ts`)
- [x] 6.5 Add `hreflang` tag for Colombian geo-targeting
- [x] 6.6 Fix footer description copy (repetitive wording)
- [x] 6.7 Revisit SimulateSection `lg` breakpoint (760px too early for 2-col) → changed to `stack:980px`
- [x] 6.8 Add `error.tsx` (error boundary) at app root
- [x] 6.9 Add `not-found.tsx` custom 404 page
- [x] 6.10 Add `manifest.json` for PWA basics → `app/manifest.ts`
- [x] 6.11 Mobile-friendly hero — added mobile-only trust card (logo + 3 trust badges: fast response, no credit impact, encrypted data + regulator line) visible below `lg` breakpoint; phone mockup remains desktop-only

## Phase 7 — Look & Feel Refinement (design handoff alignment)

> Full visual pass against the design system + prototype (`design_handoff_credalia_landing`).
> All items verified: typecheck, vitest 25/25, Playwright axe e2e 3/3 (landing, modal, legal), scoped ESLint clean.

- [x] 7.1 Security & trust signals — consolidated into trust badges across Hero (data encryption & regulatory compliance), Simulator (reassurance chips), and Footer, eliminating redundant boilerplate section and keeping clean flow
- [x] 7.2 Typography hierarchy — hero h1 keeps DM Serif Display (single brand moment); section h2s use Plus Jakarta / DM Serif Display per spec: SimulateSection, Requirements, HowItWorks, FAQ, CTA banner
- [x] 7.3 Hero heading — split h1 + stacked amount merged into one semantic h1 "Crédito digital hasta **$1.000.000**" with inline orange amount; removed redundant "Crédito digital" eyebrow; single green status badge retained; GSAP reveals phrase then pops amount
- [x] 7.4 Muted-2 token kept at `#677085` — design-system swatch `#8693a6` measured 3.11:1 on white (fails WCAG AA); prototype's `#677085` is the AA-compliant operational value (198 axe violations avoided)
- [x] 7.5 Nav — 4 section links (`#simula`, `#requisitos-band`, `#como-funciona`, `#preguntas`), desktop + mobile with scroll spy; `#requisitos-band` anchor restored on Requirements section
- [x] 7.6 Footer — brand-colored `BrandLogo variant="footer"` replaces monochrome invert-filtered `<img>`
- [x] 7.7 Legal pages (`/legal/*`) — added the missing `.legal-*` CSS block (were rendering completely unstyled); previously no classes existed in globals.css
- [x] 7.8 Wave dividers kept per user preference; WhatsApp links stay removed per user preference
- [x] 7.9 Fixed stale unit test — `config.test.ts` asserted purged `NEXT_PUBLIC_SITE_URL` key → now asserts `NEXT_PUBLIC_RATES_CONFIG_ENDPOINT`

---

## Roadmap

> Future features and improvements beyond the current audit scope.

- [ ] Rate engine integration (replace client-side `calculatePayment` with real backend pricing API)
- [ ] Dashboard API for dynamic rate/threshold configuration (replace env-var approach in 1.7.1/1.7.2)
- [ ] White-label theming system (brand colors/logo via dashboard config)
- [ ] Dark mode support (next-themes already in deps)
- [ ] Analytics dashboard / conversion funnel visualization
- [ ] A/B testing framework for CTA placement
- [ ] Multi-step form progress indicator in URL (deep-linkable steps)
- [ ] Testimonial / social proof section
- [ ] Blog / content section for SEO
- [ ] Chat widget integration (beyond WhatsApp deep link)
- [ ] Credit calculator comparison (vs. competitors / vs. other terms)
- [ ] Application status tracker page
