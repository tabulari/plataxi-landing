# Tarea A — Simulador Plataxi vs Dribbble P.O Loan (22262324)

Análisis Playwright + código. Objetivo: simulador compacto en 2 columnas con colores Plataxi,
inspirado en https://dribbble.com/shots/22262324-P-O-Loan-website (Aminul Islam).

## 1. Estado actual (https://plataxi.rubrica.dev/ #simula, medido con Playwright)

- `<form id="simulator">` de **~1199 px de alto × 768 px** (viewport desktop), 6 bloques apilados
  en una sola columna (`space-y-6`, `p-5 sm:p-8`).
- Orden vertical: AmountInput (stepper + slider h-12 + min/max) → chips Plazo → `sr-only` live →
  chips Forma de pago → `SimulationResults` (hero cuota + 2 tarjetas expandibles de servicios +
  cláusula legal) → CTA 52 px + banner solicitud activa + link "nueva solicitud".
- **Por qué se ve extenso**: todo está en una columna; `SimulationResults` solo ya trae hero +
  2 tarjetas con paneles de detalle desplegables; hints reservan `min-h`; slider ocupa `h-12`
  + fila de extremos; CTA `h-[52px]` + bloques condicionales debajo. Altura total ≈ 2× viewport.
- Wrapper: `SimulateSection` centra todo en `max-w-3xl flex flex-col` (`src/components/SimulateSection.tsx`).

## 2. Referente Dribbble (verificado: NO es 2 paneles)

Inspección de los 3 adjuntos (`userupload/9268331/32/33`): el shot P.O Loan es **una sola tarjeta
compacta** (~480 px) sobre fondo gris, NO dos paneles izquierda/derecha. Su lenguaje:

- Eyebrow uppercase pequeña ("HOW MUCH…", "OVER HOW LONG?"), monto gigante centrado
  (`$` gris + cifra navy, ~40 px), slider fino con captions min/max + sublabels Minimum/Maximum.
- Grid 3 cols de plazos rectangulares (`rounded-md` ~6 px, borde gris fino); seleccionado =
  borde azul + fill azul claro + **badge check circular** en esquina superior derecha.
- CTA full-width (`NEXT`, `rounded-md`, un solo color), caption quiet
  ("This will not affect your credit score") y 2 mini trust-items con icono al pie.
- Compacto porque: paddings ~32 px, radios pequeños, jerarquía por tamaño/uppercase
  (no por tarjetas anidadas) y **sin resultados en vivo** (wizard: el cálculo va en el paso NEXT).

> Decisión: como Plataxi necesita cuota en vivo (conversión + `aria-live`), se adapta el
> lenguaje Dribbble a **2 columnas en desktop**: izquierda form / derecha resumen sticky.
> En mobile sigue 1 columna (resumen debajo, CTA visible sin scroll eterno).

## 3. Tokens Plataxi a usar (solo paleta oficial — `src/lib/config.ts` + `globals.css`)

| Rol Dribbble | Token Plataxi | Valor |
|---|---|---|
| Azul primario (CTA, seleccionado, slider) | `bg-primary-brand` / `text-ink` sobre él (`green` es alias) | `#f6d860` mantequilla |
| Texto cifra / títulos | `text-navy` (`--color-primary-dark`) | `#111110` |
| Fondo tarjeta | `bg-card` (blanca; cream solo acentos) | `#ffffff` |
| Fill seleccionado / superficie elevada | `bg-secondary-surface` / `bg-muted` | `#fffbe0` crema |
| Texto secundario / hints | `text-muted-foreground` (AA) | `#706f63` |
| Bordes | `border-border` | `#c1c1c1` |
| Focus ring | `--focus-ring-brand` + outline `#111110` (ya existe en `globals.css`) | — |

Prohibido introducir el azul Dribbble o grises nuevos: todo sale de estos tokens.

## 4. Cambios concretos (archivos exactos)

### 4.1 `src/components/SimulateSection.tsx` (wrapper)
- `max-w-3xl flex-col` → `max-w-5xl`; mover `WhatsAppLink` al pie de la columna derecha
  (o bajo el grid en desktop) para que no alargue la tarjeta.

### 4.2 `src/components/Simulator.tsx` (estructura 2 columnas)
- `form`: quitar `space-y-6` único; usar
  `grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 p-5 sm:p-6 lg:p-7`,
  `rounded-2xl` (radio tarjeta se conserva; Dribbble usa radios chicos solo en controles).
- Columna izq (form): AmountInput compacto + Plazo + Frecuencia + CTA (`Pedir mi crédito`
  full-width, `min-h-[48px]`, `bg-primary-brand text-ink`) + caption quiet bajo CTA
  (estilo Dribbble: "Simular no afecta tu historial").
- Columna der (resumen, `lg:sticky lg:top-24 self-start`): `SimulationResults` + banner
  solicitud activa + link WhatsApp. En mobile va debajo del CTA (orden DOM: form, resumen,
  CTA duplicado o CTA solo abajo — decidir en implementación; recomendado: CTA dentro de
  columna izq en desktop y clon sticky-bottom en mobile).
- Eyebrows estilo Dribbble: labels actuales (`text-sm font-semibold`) → añadir variante
  `text-xs font-bold uppercase tracking-wider text-muted-foreground` para
  "¿Cuánto…? / Plazos / Forma de pago" (mantener `id`s `plazoLabel`/`freqLabel`).
- Alturas max: resumen `lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto`; tarjetas de
  servicios colapsadas por defecto (ya lo están; no precargar `show*Help=true`).

### 4.3 `src/components/simulator/AmountInput.tsx` (compactar ~30%)
- Cifra: `text-xl sm:text-3xl` → `clamp()`: `text-[clamp(1.75rem,1.25rem+2.5vw,2.75rem)]`,
  `$` en `text-muted-foreground` (como el `$` gris Dribbble), tabular-nums.
- Stepper: `w-11 h-11 sm:w-12` → `w-10 h-10` (44 px táctil se mantiene por padding del shell);
  slider `h-12` → `h-10`, thumb 24→20 px; fila min/max `text-xs` + sublabels como Dribbble
  o eliminar (ya existe hint de rango).
- `space-y-4` → `space-y-3`; hints sin `min-h` reservado (usar `aria-live` existente, altura
  colapsable) para recortar ~40 px.

### 4.4 `src/components/simulator/SimulationResults.tsx` (des-anidar)
- Quitar `mt-6 pt-6 border-t` (ya no es sección separada: es panel derecho con su propio
  fondo `bg-secondary-surface/40 border-green/30`).
- Hero cuota: cifra a `clamp(2rem, 1.5rem+3vw, 2.75rem)`; mantener `paymentRef` flash y
  `aria-live` (ya accesible).
- Servicios opcionales: pasar de 2 tarjetas grandes a 2 filas compactas
  (`p-3`, checkbox + label + precio en una línea, "Ver detalle" expande in-place como hoy).
- Cláusula legal: `text-[11px]` → mantener, pero mover bajo el CTA o a pie de panel derecho.

### 4.5 `src/components/ChipRadioGroup.tsx` + `src/app/globals.css` (lenguaje Dribbble)
- `.chip`: `border-radius: 999px` → `10px`; `min-height: 44px` se conserva (a11y);
  padding `0.6875rem 1rem` → `0.625rem 0.875rem`.
- `.chip.active`: mantener `border-green + bg cream` pero añadir **badge check esquina**
  (Dribbble): `.ck` posicionado `absolute -top-2 -right-2` circular `bg-primary-dark text-white`
  (requiere `position: relative` en `.chip`; hoy `.ck` es inline).
- Plazo: `flex flex-wrap` → `grid grid-cols-3 gap-2` (3 meses caben exacto, como el grid
  3×N Dribbble). Frecuencia: `grid grid-cols-2 sm:grid-cols-3 gap-2` (6 opciones; las `*`
  estimadas conservan su hint).

### 4.6 Responsive mobile-first + a11y (sin regresiones)
- Base 1 columna; `lg:` activa 2 columnas; panel derecho `sticky` solo `lg:` (en mobile el
  sticky tapa contenido).
- Touch targets ≥44 px (ya existen; no bajar `min-h` de botones/chips/slider).
- Conservar: `role=radiogroup` + roving tabindex + flechas/Home/End (ChipRadioGroup),
  `aria-live` cuota + `snapAnnouncement`, `label htmlFor`, `aria-describedby` hints,
  `prefers-reduced-motion` (flash/chips ya lo respetan), focus-visible actual.
- Contraste: amarillo `#f6d860` solo para superficies grandes con texto `#111110`
  (AA ok); nunca texto amarillo sobre blanco.

## 5. Criterio de aceptación
- Altura desktop del simulador ≤ ~750 px a 1440 px (vs ~1200 px hoy); mobile: CTA visible
  con ≤2 scrolls desde el inicio del form.
- Cero colores fuera de la paleta §3; `npm run typecheck && npm run lint` verdes;
  Playwright: screenshot `#simula` desktop + mobile y check axe sin violaciones nuevas.
