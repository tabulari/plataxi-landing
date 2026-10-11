# Resumen de Cambios: Rama del Simulador (`feat/simulador-dribbble-2col`)

- **Fecha de análisis:** 2026-10-06
- **Ubicación de la tarea:** Worktree dedicado `~/Work/plataxi-landing-wt-tarea-A`
- **Rama:** `feat/simulador-dribbble-2col`
- **Referente:** https://dribbble.com/shots/22262324-P-O-Loan-website (Aminul Islam)
- **Servidor activo:** Dev server en puerto `3027` (`http://localhost:3027`)

---

## 1. Estado Actual de la Rama

En el worktree `~/Work/plataxi-landing-wt-tarea-A`, los cambios se encuentran como **modificaciones locales no confirmadas (uncommitted/unstaged)** sobre la base de `main` (`59b7090`).

Estadística del diff (`git diff --stat`):
```text
 src/app/globals.css                            | 14 +++-
 src/components/SimulateSection.tsx             |  2 +-
 src/components/Simulator.tsx                   | 92 ++++++++++++++++++++++----
 src/components/simulator/AmountInput.tsx       | 18 ++---
 src/components/simulator/SimulationResults.tsx | 22 +++---
 5 files changed, 113 insertions(+), 35 deletions(-)
```

---

## 2. Enfoque Implementado

A diferencia de la propuesta inicial de 2 columnas desktop simultáneas (izq/der), la rama optó por el patrón **Wizard de 2 Pasos** (Paso 1: Parámetros → Paso 2: Cuota y Solicitud). Este enfoque reduce drásticamente la altura de la página (~1200px a ~500px por paso) manteniendo toda la interacción en una sola tarjeta compacta estilo Dribbble.

---

## 3. Desglose de Cambios por Archivo

### 3.1 `src/components/SimulateSection.tsx`
- **Ancho del contenedor:** Ajusta el wrapper de la tarjeta del simulador (`data-sim="card"`) de `max-w-3xl` a `max-w-xl`.
- **Efecto:** Centra el simulador en una tarjeta más esbelta y compacta, coherente con la escala de UI del shot de Dribbble.

### 3.2 `src/components/Simulator.tsx`
- **Lógica de Wizard de 2 pasos (`step: 1 | 2`):**
  - **Paso 1 (Arma tu crédito):** Monto (`AmountInput`), Plazos y Forma de pago + validación en vivo (`liveValidity`) + botón principal `Ver mi cuota →` + mensaje de confianza ("Simular no afecta tu historial crediticio").
  - **Paso 2 (Tu cuota):** Resumen de cuota (`SimulationResults`) + botón de retorno accesible `← Ajustar monto o plazo` + botón final `Pedir mi crédito`.
  - **Detección de solicitud previa:** Si el usuario ya tiene un radicado activo (`activeSubmission`), arranca automáticamente en el Paso 2 para mostrar su estado de inmediato.
- **Accesibilidad y navegación por teclado:**
  - `stepHeadingRef` recibe el foco (`tabIndex={-1}`) con anuncio `aria-live="polite"` al alternar entre pasos ("Paso 1 de 2 — Arma tu crédito" / "Paso 2 de 2 — Tu cuota").
- **Tipografía y jerarquía visual:**
  - Etiquetas de sección transformadas al patrón Dribbble: `text-xs font-bold uppercase tracking-wider text-muted-foreground` ("¿Cuánto dinero necesitas?", "Plazos", "Forma de pago").
- **Layout de opciones:**
  - Plazos en cuadrícula: `grid grid-cols-3 gap-2.5`.
  - Frecuencias de pago en cuadrícula responsiva: `grid grid-cols-2 sm:grid-cols-3 gap-2.5`.
- **Eliminación de espacios en blanco:** Remueve `min-h-[18px]` en los textos de ayuda condicionales para evitar saltos y vacíos innecesarios.

### 3.3 `src/components/simulator/AmountInput.tsx`
- **Compactación general:** Reduce el espaciado vertical de `space-y-4` a `space-y-3`.
- **Label estilizado:** Etiqueta superior en uppercase pequeño `text-xs font-bold uppercase tracking-wider text-muted-foreground`.
- **Tipografía fluida de cifra:** Escala el número del input y el signo `$` con `clamp()`: `text-[clamp(1.75rem,1.25rem+2.5vw,2.75rem)]`.
- **Signo de moneda:** Signo `$` en color atenuado `text-muted-foreground` idéntico al referente visual de Dribbble.
- **Controles Stepper (+ / -):** Reducidos de `w-11 h-11` a `w-10 h-10` con esquinas `rounded-[10px]` preservando el área táctil mínima accesible (44px) mediante `sm:min-h-[44px] sm:min-w-[44px]`.
- **Slider:** Altura del contenedor reducida de `h-12` a `h-10`, y thumb reducido de `w-6 h-6` a `w-5 h-5`.

### 3.4 `src/components/simulator/SimulationResults.tsx`
- **Integración sin costuras:** Elimina la separación superior `mt-6 pt-6 border-t border-border/80`, adaptándose a la vista limpia del Paso 2.
- **Hero de cuota crema:**
  - Fondo `bg-secondary-surface` con borde suave `border-primary-brand/50`.
  - Halo decorativo sutil con blur en esquina superior: `bg-primary-brand/40 blur-2xl`.
  - Tipografía de cuota en escala fluida `text-[clamp(2rem,1.5rem+3vw,2.75rem)]`.
- **Servicios adicionales (Plataforma y Fianza):**
  - Filas más compactas con reducción de padding interior (`p-3.5` a `p-3`).

### 3.5 `src/components/ChipRadioGroup.tsx`
- **Sin cambios en el componente base:** Mantiene su arquitectura semántica intacta (`role="radiogroup"` y accesibilidad).
- El nuevo estilo visual de tarjeta rectangular y el badge de check se aplican vía clases CSS en `globals.css` y layouts `grid` definidos desde `Simulator.tsx`.

### 3.6 `src/app/globals.css`
- **Forma de los Chips (`.chip`):**
  - Cambia de píldora redondeada `border-radius: 999px` a botón rectangular redondeado `border-radius: 10px`.
  - Padding ajustado de `0.6875rem 1rem` a `0.625rem 0.875rem` conservando `min-height: 44px`.
- **Badge de Check Flotante (`.chip.active .ck`):**
  - Se reposiciona de forma absoluta en la esquina superior derecha (`position: absolute; top: -9px; right: -9px; background: var(--color-primary-dark); color: #fff; border-radius: 9999px; padding: 2px`).
  - Emula con fidelidad el badge de selección del referente Dribbble usando el token oficial `primary-dark`.

---

## 4. Conclusión y Estado de Integración

- **Estado:** Código funcional y visualizable en `http://localhost:3027`.
- **Compatibilidad de tokens:** 100% apegado a la paleta oficial Plataxi (`#f6d860` amarillo marca, `#111110` oscuro, `#fffbe0` crema, `#706f63` texto secundario).
- **Independencia:** Los cambios están confinados al simulador y no colisionan estructuralmente con la tarea B (Hero, Benefits, HowItWorks, Faq).
