# Landing Page Specification

## Surface Categories

### Category 8: Phone Hero Realism (10pts)

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | Phone shell is 260×563px, screen area 244×547px (8px bezel padding on all sides: 563 − 2×8 = 547) | exact | `getBoundingClientRect()` on `.phone` and screen child |
| 2 | Body gradient is titanium (multi-stop dark gray, not solid black) | exact | `getComputedStyle().background` contains `linear-gradient` with ≥6 stops |
| 1 | Dynamic Island: 80×22px, `#000`, border-radius 20px, camera dot present | exact | `getBoundingClientRect()` + `getComputedStyle()` |
| 1 | Border-radius: body 55px, screen 47px | exact | `getComputedStyle().borderRadius` |
| 1 | Drop-shadow: 4 layers, all navy-tinted (rgba(13,42,94,...)), no gray shadows | exact | `getComputedStyle().filter` or computed shadow |
| 1 | Metallic edge visible (side buttons, body outline) | range | `::before`/`::after` pseudo-elements exist on `.phone` |
| 1 | Green glow under phone: 140×28px, rgba(30,158,85,0.08), blur 32px | exact | `getBoundingClientRect()` + `getComputedStyle()` on glow element |
| 1 | Resting state: phone sits perfectly still (NO perpetual float/bob — reads as childish for a fintech). After the chat entrance settles, the shell holds a fixed level transform with `animationName: none` and no GSAP yoyo tween. | exact | Sample `getComputedStyle().transform` 5× over ~2.5s with no input → all identical |
| 1 | Desktop parallax: on `min-width:980px` (non-reduced-motion), the phone tilts toward the cursor in 3D (`matrix3d`, rotateY/rotateX a few degrees) and eases back to level on `mouseleave`. Mobile + reduced-motion = fully static, no tilt. | range | Real `mouse.move` to opposite corners → distinct `matrix3d` transforms; reduced-motion/mobile → `transform: none` constant |

### Category 9: Simulator Integrity (10pts)

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | Payment amount matches `calculatePayment()` output for default values | exact | `textContent` matches `fmtCOP(calculatePayment(amount, term, rate))` |
| 2 | Amount slider and input are synchronized | range | Change slider → input value matches; change input → slider position matches (input is `readOnly` mobile-first — slider→input is one-way, `range` tolerance) |
| 1 | Term chip selection highlights active chip (secondary-surface bg #fffbe0, primary-brand border #f6d860 via `green-soft`/`green` alias) | exact | `getComputedStyle()` on active chip vs inactive (`bg-secondary-surface` / `border-primary-brand`) |
| 1 | Frequency selector switches calculation mode | range | Different frequency → different payment amount (when ≥2 frequencies allowed per VENTANA matrix `isFrequencyDisabled`) |
| 1 | Payment value animates on change (.flash class applied on sim.payment change, 0.28s ease-out) | exact | `.flash` class applied on value change with `prefers-reduced-motion` guard |
| 1 | Optional services cards present (plataforma + fianza) with reactive checkboxes and fee breakdown | exact | Both service cards exist with checkboxes (`#opt-platform`, `#opt-guarantee`) and dynamic COP cost calculation |
| 1 | Error message appears for invalid input | range | `role="alert"` element visible when amount out of range or `isFrequencyDisabled`/`isTermDisabled` |
| 1 | Simulator card has glow border (border-t-[3px] primary-brand/40 → `rgba(246,216,96,0.4)` via `green/40` alias) | exact | `getComputedStyle().borderTop` contains `rgba(246,216,96)` |

### Category 10: Narrative Flow (10pts)

| Pts | Criterion | Precision | Verify With |
|-----|-----------|-----------|-------------|
| 2 | Section order: Hero → Simulate → Requirements → HowItWorks → Faq → CtaBanner | fuzzy⚠️ | `<section>` order by DOM position |
| 2 | Section backgrounds alternate correctly: white → soft → white → green-soft → white → navy-deep | fuzzy⚠️ | `getComputedStyle().backgroundColor` per section |
| 1 | Wave dividers between sections (5 total, amplitudes: soft/soft/medium/medium/bold) | fuzzy⚠️ | Count `SectionDivider` SVGs, check viewBox heights |
| 1 | Every section has eyebrow (`uppercase tracking-widest text-xs`) + h2 (`font-display tracking-tight`) | exact | Query eyebrow and h2 in each section |
| 1 | All h2 use `--font-display` | exact | `getComputedStyle().fontFamily` contains `DM Serif Display` |
| 1 | Vertical rhythm: sections use `py-16 lg:py-24` (96px desktop). **Documented exception: Hero** uses `pt-12 pb-8 lg:pt-16 lg:pb-12` (compact ~75vh hero per the hero-compaction redesign — intentional, not a deviation to flag) | range | `getComputedStyle().paddingTop` matches 64px/96px on non-Hero sections; Hero matches its compact values |
| 1 | StickyBar visible when past hero CTAs and simulator not in viewport | range | Scroll past hero → bar has `show` class; scroll to simulator → bar hidden |
| 1 | CtaBanner has dot-grid background pattern (on child `div.absolute` with `radial-gradient`) | exact | `getComputedStyle()` on first `div.absolute` child of CtaBanner section contains `radial-gradient` |

## Surface Context

```yaml
Role: Convert visitors into credit applicants through trust, clarity, and action
Entry points: Direct URL, referral link, ad campaign
Exit points: Apply button (primary), WhatsApp link (secondary), legal pages
Key interactions: Simulate credit → View results → Apply
Emotional state: Curious → Cautious → Reassured → Confident → Action
```

## Spec Customization

### Visual Fidelity Overrides

| Criterion | Landing Value | Default Value |
|-----------|--------------|---------------|
| Hero h1 size | 48/72px | — |
| Amount size | 60/96px | — |
| Hero atmospheric gradient | 3-layer radial (navy/green/orange) | — |

### AA-Contrast Token Rules (dark/tinted surfaces)

The base `--green` (#1e9e55) and `--orange` (#f5601b) fail WCAG AA (4.5:1) as small
text on several surfaces. Use the contrast-safe variants:

| Surface | Use token | Ratio | Never use |
|---------|-----------|-------|-----------|
| Green text on navy/navy-deep | `text-green` (#1e9e55) | 4.97:1 | green/80 (3.6:1) |
| Green text on CTA panel (white/.04 over navy) | `text-green-bright` (#2bbd6a) | 5.73:1 | green (4.06:1) |
| Green text/number on green-tint (#e7faf4) | `text-green-ink` (#15793f) | 5.05:1 | green (3.19:1) |
| Orange text on light orange tint | `text-orange-ink` (#c2440a) | 4.64:1 | orange (2.91:1) |
| Muted text on white/sticky bar | `text-muted-2` (#677085) | 4.96:1 | text-muted (#f7f9fa bg token — invisible) |

Simulator native controls (stepper ±, range slider, "Ingresar monto exacto", amount
input) must carry `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
— they are plain `<button>`/`<input>` outside the `Button` component and otherwise fall
back to the browser default `1px auto` ring.

### Layout Overrides

| Criterion | Landing Value | Default Value |
|-----------|--------------|---------------|
| Hero grid ratio | `1.1fr:0.9fr` at `stack:` | — |
| Phone visibility | `stack:` (980px) only | — |
| Simulator grid | `380px:1fr` at `stack:` | — |

### Motion Overrides

| Criterion | Landing Value | Default Value |
|-----------|--------------|---------------|
| Hero entrance | SplitText chars, stagger 25ms | — |
| Phone entrance | rotateY -8 → 0, scale 0.92 → 1 | — |
| Phone motion | Still at rest; desktop cursor parallax only (no perpetual float) | — |
| Simulator spring | `back.out(1.2)`, 700ms | — |
| Card reveals | ScrollTrigger, y:30, stagger 100ms | — |

### Accessibility Overrides

| Criterion | Landing Value | Default Value |
|-----------|--------------|---------------|
| Sticky bar | `aria-live="polite"`, `inert` when hidden | — |
| Simulator | `role="alert"` on error | — |
| FAQ | Single rotating chevron | — |

### Component-Specific Criteria

| Component | Key Measurements |
|-----------|-----------------|
| Nav | h-68px, sticky/fixed, bg-background/85 backdrop-blur-md |
| Hero | Full-bleed photo hero (`/hero-updated.jpeg`, `objectPosition: '75% 36%'`), scrim calibrated for WCAG AA, capped height (`min-h-[520px] ... max-h-[750px]`) ensuring CTA above the fold, reactive `HeroActiveNotice` pill |
| Phone | Photo-based hero (hero-updated.jpeg fill, not phone shell) — Category 8 Phone Hero is reserved, not active for Plataxi photo hero |
| Simulator | green glow border-t-[3px], chip radio group, flash animation |
| Requirements | max-w-lg, 18px icons, 20px animated checks, counter chip |
| HowItWorks | 4-step white cards (rounded-lg, shadow-sm) on green-soft, progressive left-border accent (bg-green/25→50→75→100), step 4 destination treatment (bordered badge, ring-1 ring-green/30, green glow); grid 1→2→4 cols; compact mobile (p-3, w-8 badges, text-xs); CTA after step 4; timeline connector at lg+ |
| Faq | max-w-3xl, clean cards on surface-card, single-open on mobile, WA CTA at bottom, FAQPage JSON-LD |
| CtaBanner | dot-grid bg, contained action panel (bg-white/[0.04] ring-1 ring-white/10 rounded-2xl), CheckCircleIcon bullets, urgency subtext, conditional disbursement. **Eyebrow uses `text-green-bright` (#2bbd6a)** — the standard `--green` fails AA (4.06:1) on the lightened panel bg; green-bright = 5.73:1 |
| Footer | 2-tier structure: (1) 4-col responsive grid (`sm:col-span-2` Brand+Socials / Plataforma / Soporte), (2) compliance & legal strip (`border-t border-primary-brand/10` with Razón social · NIT · Domicilio · Teléfono, copyright © + Habeas Data Ley 1581 note at text-white/55); metallic honeycomb `footer-texture` + `footer-grid-drift` with interactive `footer-cursor-glow`. WhatsApp consolidated in Simulator + FAQ; support in footer uses mailto and PQRS. Social icons (Facebook, Instagram, YouTube) $\ge 44\times 44\text{px}$ with `aria-hidden` SVGs and explicit `aria-label`s; links have `min-h-[44px]` |
| StickyBar | bg-white/95, safe-area-inset-bottom padding, shows past hero/simulator hidden |
| SectionDividers | 5 total: soft/soft/medium/medium/bold amplitudes |
