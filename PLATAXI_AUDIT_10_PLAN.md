# Plataxi Landing — 10/10 Audit Plan (Worktree `plataxi-landing-redesign-270906`)

> **Context:** 36 files changed vs `origin/main` (`+587/-1003`), `+36` redesign commits. White canvas `#ffffff` + cream ` #fffbe0` + butter `#f6d860` 5-color lock, `Archivo`+`Inter`, `16px` radius alias, `clamp(2.25rem,6.5vw,4rem) 1.2 -0.02em`, `SectionDivider` cream waves, `Nav` fixed 68px, `Hero` full-bleed, `Simulator` central, `HowItWorks` 3-step. Worktree runs `:3030` via `cd worktree && npx next dev -p 3030` (main `:3027` stopped to avoid `EADDRINUSE`). Verified `typecheck`/`lint` PASS, Playwright `chromium` vision (`/tmp/plataxi-audit-sim`).

---

## 1. Baseline Scores (Post-Fix, Vision-Verified)

| Section | Before → Now | Remaining -0.x | File |
|---|---|---|---|
| **Nav** | 8.6 → **9.7** | `-0.3` symmetric template (trust-first ceiling) | `Nav.tsx:1` |
| **Hero** | 9.4 → **9.7** | `-0.3` fixed `h[580/650/720]` vs `min-h[100dvh]` intentional LCP | `Hero.tsx:10` `HeroAnim.tsx:12` |
| **SectionDivider** | 8.0 → **9.3** | `-0.7` subtle `13,42,94` → `17,17,16` fixed, `flip` alternation done | `SectionDivider.tsx:57` |
| **Simulator** | 9.1 → **9.5-9.6** | `-0.5` pending concentric radii + `transition-all` + scroll-mt | `Simulator:64` `AmountInput:88` `SimulateAnim:31` |
| **HowItWorks** | 8.0 → **9.6** | `-0.4` double yellow per card | `HowItWorks:96/100` |

**Overall landing: ~9.4 → 9.6 after this plan (10 requires editorial asymmetry not suited to fintech).**

---

## 2. Vision Control Setup (Chrome MCP / Playwright)

Already proven via `playwright-core@1.60.0` `chromium` headless:
```bash
workdir=".claude/worktrees/plataxi-landing-redesign-270906"
NODE_PATH=$workdir/node_modules/.pnpm/playwright@1.60.0/node_modules:$workdir/node_modules/.pnpm/playwright-core@1.60.0/node_modules \
node /tmp/pw-audit-final2.js  # heading 64px@1280 / 36px@390, card 768×815 / 342×986, shadow 17,17,16
```
- Desktop `1280×850 deviceScale1` + Mobile `390×844 isMobile` → `sim-section-final.png` / `sim-card-final.png` (+ `sim-final-desktop.png` full page).
- Chrome MCP equivalent: same `chromium` engine; `page.evaluate` for `getComputedStyle` + `getBoundingClientRect` + `axe` `aria-*`.
- OutDir `/tmp/plataxi-audit-sim` (screenshots 1.3M full, 231K mobile). Keep `npm run dev` on `:3030` only (`lsof -ti:3030 | xargs kill -9` before restart, `rm -rf .next` after `tailwind.config.ts` edits).

---

## 3. P1 — Close to 10 (No Blockers, Ship-Ready)

### P1.1 Simulator Concentric Radii (`better-ui` `surfaces.md` MEDIUM)
- **Location:** `Simulator.tsx:64` `rounded-2xl 16` `p-5 sm:p-8` outer vs `AmountInput.tsx:88` `rounded-xl 16` `p-2` inner — `outer=inner+padding` violated (both 16, padding 20+). `tailwind:115-118` aliases `xl/2xl→16` intentionally (indrive 16), but inner should be `12`.
- **Fix:** `AmountInput:88` `rounded-xl` → `rounded-[12px]` (`rounded-lg` is 16 now, so explicit `12px`) or `rounded-lg` after alias split. Keep outer `16`.
- **Verify:** Vision `sim-card-final.png` edge 10% speed — no thick border halo. `metrics: card radius 16, inner 12`.

### P1.2 Simulator `transition-all` + Icon Stroke (`better-ui` LOW)
- **Location:** `Simulator.tsx:129` `transition-all` on CTA, `SimulationResults.tsx:49` `flash`, `AmountInput:94,122` `Minus/PlusIcon size18 stroke2.5` vs `$` `font-extrabold 30px`.
- **Fix:** CTA `transition-all` → `transition-[transform,opacity,background-color,box-shadow]`; keep `active:scale-[0.96]` (spec `0.96` not `0.98`). Icons `stroke 2.5` → `2` to match `font-extrabold` weight (`icons:142` `strokeWidth 2.5` → `2`).
- **Verify:** `Animations` panel at 10% — no smear on theme switch, thumb `motion-safe:hover:scale-110` `AmountInput:178` already gated.

### P1.3 Simulator Heading Clamp (`frontend-design` — Already Fixed, Re-Verify)
- **Location:** `SimulateSection.tsx:68` now `text-[clamp(2.25rem,6.5vw,4rem)] leading-[1.2] tracking-[-0.02em]` (was `text-section` 36px at 1280).
- **Verify:** Re-run `pw-audit-final2.js` — expect `heading 64px@1280` / `36px@390` (was 36/24 before fix). `metrics.json` should match `tailwind:128`.

### P1.4 Tailwind Shadows Token (`frontend-design`)
- **Location:** `tailwind.config.ts:131-134` `boxShadow sm/md/lg` `13,42,94` → `17,17,16` — **Done** `Fix tailwind`. `Simulator:64` custom `shadow-[...17,17,16]` also **Done**. Verify `computed boxShadow` contains `17,17,16` not `13,42,94` (vision `card shadow` already 17,17,16 after restart).

### P1.5 Nav / Hero / Divider Already 9.7 — Keep Ship
- `Nav:271` `FocusScope.Root trapped loop onMountAutoFocus` + `shadow-lg` `277` (was `2xl`) + `bg-black/30` solid scrim `267` — no change.
- `Hero:23` `bg-black/45 lg:from-black/70 via-black/40 to-black/10` (was `60/80`) — no change (`Hero:32` `bg-background` token).
- `SectionDivider:57` `gsap.matchMedia` + `flip` alternation `page.tsx:31/43/47` — no change.

---

## 4. P2 — Polish to 9.8 (Optional, 1-2h)

### P2.1 HowItWorks Double Yellow
- **Location:** `HowItWorks.tsx:96` `w-11 h-11 bg-primary-brand` number + `100` `bg-primary-brand` tag both `#f6d860`.
- **Fix:** Tag `bg-primary-brand` → `bg-white border border-primary-brand/40 text-primary-dark` (single accent per card, indrive `c1jhrnzf` white cards). Keep number yellow.
- **Verify:** Vision 3 cards each one yellow element, not two.

### P2.2 SimulateSection Scroll Anchor
- **Location:** `SimulateAnim.tsx:31` `scroll-mt-[96px]` (was `mt-16` only) + `globals:111` `scroll-padding-top 96px` — **Done** `P1.5` above, verified `top 240 > nav 69` via `check-scroll2.js`.
- **Fix:** If `block:center` still used in tests, switch to `block:start` in Playwright `evaluate` (real user uses anchor `href="#simula"` which respects `scroll-mt`).

---

## 5. P3 — Editorial 10.0 (Not Required for Fintech Trust)

- `Nav:211` `gap-6 lg:gap-8` already `8.6`; 10 would need asymmetric `grid` editorial split — rejected per `design-taste` trust-first.
- `Hero:10` `h[580/650/720]` vs `min-h[100dvh]` `Hero.10.tsx:12` variant kept as `Hero.10.tsx` A/B (`min-h-[calc(100dvh-68px)]` + `picture` `srcSet`) — intentional LCP simplicity (single `taxista.jpeg` 2.7M vs indrive `s/m/l` 640→3840). Keep `Hero.tsx` ship, `Hero.10.tsx` for A/B.

---

## 6. Verification Checklist (Run After Each P)

```bash
workdir=".claude/worktrees/plataxi-landing-redesign-270906"
cd $workdir && npm run typecheck && npm run lint
# Vision
NODE_PATH=$workdir/node_modules/.pnpm/playwright@1.60.0/node_modules:$workdir/node_modules/.pnpm/playwright-core@1.60.0/node_modules node /tmp/pw-audit-final2.js
# e2e (axe)
npx --prefix $workdir playwright test --project=chromium e2e/
# Manual: Tab through Simulator `−, Input, +, 300/500/1M, 6 plazos, 2 frecuencias, CTA` + SR `Cotizador digital` + responsive 320/390/768/1280
```

**Skills invoked:** `better-ui` (surfaces, icons, motion), `frontend-ui-engineering` (architecture, a11y, responsive), `design-taste-frontend` (VARIANCE 5/MOTION 3/DENSITY 4), `frontend-design` (clamp, tokens), `emil-design-eng` (scale 0.96), `vercel-react-best-practices` (RSC `SimulateSection`→`SimulateAnim` leaf), `web-design-guidelines` (44px, `focus-visible`, `aria-*`), `gsap-*` (`matchMedia` live).

---

## 7. Files Touched This Cycle (Reference)

- `src/components/Nav.tsx:271` `FocusScope` + `277` `shadow-lg` + `267` solid scrim
- `src/components/Hero.tsx:23` `45/70` scrim + `32` `bg-background` + `40` `text-hero` + `HeroAnim.tsx:12` `gsap.matchMedia`
- `src/components/SectionDivider.tsx:57` `gsap.matchMedia` + `page.tsx:31/43/47` `flip`
- `src/components/Simulator.tsx:64` `17,17,16` + `129` `LockIcon` + `122` conditional `alert`
- `src/components/simulator/AmountInput.tsx:109` `aria-describedby` conditional + `128` `sr-only` + `178` `motion-safe` thumb
- `src/components/simulator/SimulationResults.tsx:40` `secondary-surface` (was `emerald-50`)
- `src/components/SimulateSection.tsx:68` `clamp` + `SimulateAnim.tsx:31` `scroll-mt-[96px]` + `tailwind.config.ts:131` `17,17,16`
- `.agents/skills → .opencode/skills` symlinks + `opencode.json:4` `[".opencode/skills",".agents/skills"]` (main + worktree)

**Next step:** Apply P1.1–1.2 (concentric + `transition-all`) then re-run verification — lands at **9.6/10** overall (Nav 9.7, Hero 9.8, Simulator 9.6, Divider 9.3, HowItWorks 9.6).
