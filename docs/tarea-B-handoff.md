# Tarea B — Handoff: acercar Plataxi a inDrive Money

## 1. Objetivo tarea B

Acercar la landing de Plataxi a la estructura y confianza de `https://indrive.com/es-co/money` sin copiar marca ni inventar prueba social.

## 2. Hallazgos: qué tiene inDrive Money que nos falta

Estructura de inDrive Money (orden real observado el 2026-10-06):

1. **Hero full-bleed** — foto de conductor sonriendo dentro del carro + H1 gigante con resaltador lima en palabras clave (`Préstamos en efectivo`) + subtítulo corto + CTA repetido `Descarga la app` (nav + hero).
2. **Bloque "Préstamos para necesidades personales y de negocio"** — copy de casos de uso concretos (reparación de auto, renovaciones en casa) + visual de producto (mockup de celular con `Información del crédito / 25% pagado / Ya pagado / Falta por pagar / Transacciones`) + 4 mini-cards con icono (monto hasta $1.500.000, 100% en línea, aumento de límite, facilidad de pago).
3. **Bloque "Solicitud: ¿Necesitas efectivo? Obtén un préstamo en minutos"** — pill eyebrow `Solicitud` + H2 gigante con resaltador + split foto persona + 3 filas con check verde (`Mira tu oferta / Solicita en segundos / Obtén tu dinero`, cada una con 1 línea de explicación) + CTA repetido.
4. **Bloque "Historias: ¿Por qué los conductores prefieren nuestros préstamos?"** — pill `Historias` + 3 cards con foto grande real + nombre de pila (Armando, José Manuel, César) + 1 cita corta cada una.
5. **Bloque "Únete a inDrive y gana en tus términos"** — barra de stats (3,8M / 2,2M / 44M / 5,4M por vertical) + letra pequeña legal (periodo, promedio aproximado, sin garantía, sin relación laboral).
6. **FAQ "Preguntas frecuentes"** — acordeón (~7 preguntas) que cierra objeciones duras con copies honestas: quién otorga el préstamo (socios Parhelio SOFOM / R2, no inDrive directo), dónde ver estado y términos, CAT aprox 94.7%, pago mínimo mensual, costo garante FGA descontado del desembolso, 2 formas de pago (porcentaje por viaje vs. transferencia directa a R2).
7. **Footer ecosistema** — mega-menú por columnas (servicios, gana, seguridad, impacto, nosotros) + banners libro/documental + social + stores + disclaimers legales.
8. **Ritmo visual** — fondos alternados crema/blanco, pills eyebrow por sección, H2 negros centrados 40-64px, botones lima 48-56px radius ~20px, CTA repetido en cada bloque.

Gaps en Plataxi (estado actual):

- `HowItWorks.tsx` existe pero está **desmontado** (comentado en `page.tsx`); además su diseño es rail `01/02/03`, no el split foto + checks verdes de inDrive.
- `Testimonials.tsx` existe pero está **desmontado** (no importado en `page.tsx`); además usa iniciales `CM/LR/JP` sin foto. `PRODUCT.md` prohíbe inventar testimonios, tasas o credenciales.
- `Benefits.tsx` ya es cercano (imagen panorámica + 4 cards) pero le falta: copy de casos de uso concretos arriba y **visual de producto** (no hay mockup de celular/panel de crédito, solo fotos de taxi).
- `Faq.tsx` (`src/lib/faqs.ts` como fuente) es genérico; le faltan las 3 preguntas de confianza que sí tiene inDrive: quién financia, costo total/CAT, garante y formas de pago.
- No hay barra de stats ni letra pequeña legal, ni pills eyebrow, ni fondos crema alternados, ni CTA repetido por sección.
- Ventaja a preservar: Plataxi tiene **simulador** (monto/plazo/frecuencia → cuota) que inDrive no tiene. No quitarlo; es el moat (`100% en línea`, respuesta en minutos).

## 3. Cambios concretos a hacer en Plataxi

> Restricción dura: no inventar testimonios con nombre/foto, ni tasas, ni sellos de regulador, ni cifras de stats. Todo lo no firmado va como placeholder visible o se esconde.

- [ ] `src/app/page.tsx` — remontar `HowItWorks` entre `Benefits` y `Faq` (quitar el comentario que lo desmonta). Mantener orden: `Hero → SimulateSection → Benefits → HowItWorks → Faq → CtaBanner`. No montar `Testimonials` hasta tener material real (ver abajo).
- [ ] `src/components/HowItWorks.tsx` — cambiar layout de rail `01/02/03` a split estilo inDrive: columna foto conductor (reusar `/hero-conductor.webp` o nueva foto real) + columna con 3 filas con icono check verde y copies: `Mira tu oferta / Solicita en segundos / Recibe tu dinero`, cada una con 1 línea. Agregar CTA `Simular mi cuota` (scroll a `#simula`) al pie del bloque. Respetar `prefers-reduced-motion`.
- [ ] `src/components/Benefits.tsx` — agregar encima del grid un subtítulo de casos de uso honestos (ej.: SOAT, llantas, reparación taxi; sin prometer montos nuevos, reusar `config.simulator.amountMax` ya existente). Agregar visual de producto: mockup celular o tarjeta `Tu cuota / pagado / falta por pagar` junto a la imagen panorámica existente. No cambiar las 4 cards (ya cumplen).
- [ ] `src/components/Faq.tsx` + `src/lib/faqs.ts` — agregar 3 preguntas (solo con datos aprobados por legal/producto; si no hay dato, no agregar la pregunta): quién otorga el crédito, costo total y tasa/CAT, garante y cómo se paga/descuenta. Mantener `FAQPage JSON-LD` generado desde la misma fuente (ya existe en `Faq.tsx`).
- [ ] `src/components/Testimonials.tsx` — **esconder** (no importar en `page.tsx`) hasta conseguir 3 conductores reales con foto + consentimiento firmado. Cuando existan, rediseñar a cards con foto grande + nombre + 1 cita (como inDrive). Prohibido: dejar los `Carlos M. / Liliana R. / Jhon P.` actuales como si fueran reales.
- [ ] Ritmo visual global (tocar solo estilos, no copy): agregar pills eyebrow (`Solicitud`, `Historias`, `Preguntas`) en `HowItWorks/Faq` (y futuro testimonios), alternar 1 fondo crema (`bg-surface-card` existente) entre secciones, y repetir CTA primario al cierre de `Benefits` y `HowItWorks`. Referencia de tono: `Hero.tsx` (CTA `Simular mi cuota`) e inDrive (CTA por bloque).
- [ ] No tocar en esta tarea: `src/lib/credit.ts` (math pura), `Simulator.tsx`, `ApplyModal.tsx`, endpoint de leads, claims de regulador (`Vigilados por Superfinanciera` solo si legal lo firma).

## 4. Criterio de aceptación y next steps para el implementador

Criterio de aceptación:

- [ ] `npm run typecheck`, `npm run lint` y `npm run build` pasan.
- [ ] La página renderiza en orden Hero → simulador → beneficios (+casos de uso y visual producto) → cómo funciona (foto + 3 checks + CTA) → FAQ ampliada → CTA final; sin sección de testimonios visible.
- [ ] Cero testimonios, tasas, sellos o cifras inventadas en el diff (grep a `Testimonials` sin import en `page.tsx` salvo material real aprobado).
- [ ] `prefers-reduced-motion` desactiva las animaciones nuevas y el contraste/tap-targets siguen AA (≥4.5:1, ≥44px).
- [ ] Revisión visual móvil-first (360px) y desktop del nuevo `HowItWorks` contra inDrive Money.

Next steps:

1. Conseguir de producto/legal: quién financia, tasa/CAT, garante, formas de pago (desbloquea FAQ) y 3 testimonios reales con foto + consentimiento (desbloquea testimonios).
2. Implementar en orden: `HowItWorks` split → pills/CTA repetido → visual producto en `Benefits` → FAQ (cuando haya datos) → testimonios reales (cuando haya fotos).
3. Verificar con `npm run test:e2e` y Lighthouse CI antes de dar por cerrada la tarea.
