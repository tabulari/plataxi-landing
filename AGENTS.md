# AGENTS.md — Plataxi Landing Guidelines

Welcome to the **Plataxi Landing** codebase (Credalia digital credit platform in Colombia). This file serves as the operational guide for all AI coding agents (Gemini, Antigravity, and other coding assistants).

---

## 1. Project Overview & Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS, `@base-ui/react`, `tw-animate-css`
- **Animation**: GSAP 3 + `@gsap/react`
- **Icons**: `lucide-react`
- **Validation**: `zod`
- **Components & Themes**: `shadcn/ui`, `next-themes`, `sonner`
- **Testing**: Vitest (unit/component), Playwright (E2E / a11y via `@axe-core/playwright`), Lighthouse CI

---

## 2. Key Commands

```bash
# Development
npm run dev          # Starts Next.js dev server on port 3027

# Verification & Testing
npm run build        # Production Next.js build
npm run typecheck    # TypeScript compiler check (tsc --noEmit)
npm run lint         # Next.js ESLint
npm run test         # Run unit & integration tests with Vitest
npm run test:credit  # Run credit calculation tests
npm run test:e2e     # Run Playwright end-to-end tests
npm run lhci         # Run Lighthouse CI audit
```

---

## 3. Active Agent Skills

The following skills are installed in `.agents/skills/` and must be leveraged according to task context:

### Design & Aesthetic Quality
- **`design-taste-frontend`** (`.agents/skills/design-taste-frontend/SKILL.md`):
  Anti-slop frontend skill for landing pages, marketing sites, and redesigns. Run before generating UI to infer the project vibe and calibrate the `VARIANCE`, `MOTION`, and `DENSITY` dials. Avoid generic templates, repetitive 3-card grids, and ungrounded gradients.
- **`frontend-design`** (`.agents/skills/frontend-design/SKILL.md`):
  Guides distinctive visual design, fluid typography using `clamp()`, cohesive color tokens, dark mode elegance, and accessible interaction patterns.
- **`emil-design-eng`** (`.agents/skills/emil-design-eng/SKILL.md`):
  Applies Emil Kowalski's interaction design and animation principles for micro-interactions, layout transitions, and tactile software feel.

### Component Architecture & Implementation
- **`shadcn`** (`.agents/skills/shadcn/SKILL.md`):
  Standard for managing, searching, adding, and composing shadcn/ui and registry components. Use existing components before writing custom implementations.
- **`vercel-react-best-practices`** (`.agents/skills/vercel-react-best-practices/SKILL.md`):
  Strict performance optimization rules from Vercel Engineering: React Server Components (RSC) vs Client boundaries, hydration safety, bundle optimization, and lean data fetching.

### Audits, Reviews & Accessibility
- **`web-design-guidelines`** (`.agents/skills/web-design-guidelines/SKILL.md`):
  Enforces Vercel Web Interface Guidelines. Use when asked to review UI, check accessibility, audit touch targets (≥44px), verify focus-visible states, keyboard operability, and semantic HTML.
- **`improve-ui`** (`.agents/skills/improve-ui/SKILL.md`):
  Audit existing UI surfaces against established product and brand evidence without compromising identity.

---

## 4. Engineering Principles

1. **Accessibility First**: Semantic HTML elements (`<button>`, `<main>`, `<nav>`, `<a>`) take precedence over generic `<div>` with handlers. All interactive elements must have visible focus rings and proper ARIA labels.
2. **Performance & Motion**: Use GSAP or CSS transforms for animations; avoid triggering layout reflows (`width`, `height`, `top`). Respect `prefers-reduced-motion`.
3. **Mobile Responsive**: Plataxi users predominantly access the loan simulator on mobile devices. Design mobile-first and test responsive scaling across breakpoints.
