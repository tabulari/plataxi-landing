# Auditoría: inDrive Money vs Plataxi local (:3028)

- **Fecha:** 2026-10-06
- **Referente:** https://indrive.com/es-co/money — «Préstamos para conductores en Colombia | inDrive»
- **Local:** http://localhost:3028/ — «Plataxi - Crédito digital 100% en línea» (rama `main`, HTTP 200)
- **Método:** Playwright Chromium headless (1440×900 desktop + 360×800 mobile, screenshots viewport + full-page), volcado de DOM/H1-H2/CTAs y lectura del código fuente del local.
- **Evidencia visual:** `/tmp/opencode/audit/` (`indrive-{desktop,mobile}-{top,full}.png`, `local-{desktop,mobile}-{top,full}.png`).
- **Nota:** inDrive sirvió 403 a `curl` y a una segunda pasada de Playwright (protección anti-bots); la primera pasada rindió 200 con screenshots y el texto se verificó por fetch directo. No se inventa ningún dato: lo no visible se marca como tal.

## 1. Hero

| Aspecto | inDrive | Plataxi local | Gap |
|---|---|---|---|
| H1 | «Préstamos en efectivo **para conductores de inDrive**» (audiencia explícita en el H1) | «Soluciona tu día, **crédito en minutos**» (beneficio, sin audiencia) | 🟡 Local no nombra al taxista/conductor en el H1; inDrive filtra y conecta desde el primer segundo |
| Subcopy | (apoyos bajo el H1 no capturados en texto; el peso lo lleva el H1 + foto) | «Solo con tu cédula y tu celular. Elige el monto que necesitas hoy y págalo a tu ritmo con cuota fija diaria.» — concreta requisitos y producto | 🟢 Local mejor: requisitos + mecánica en 2 líneas |
| Foto | Conductor sonriendo al volante, encuadre interior del carro | Taxi amarillo + conductor con pulgar arriba (Valledupar, placa VAL-245) | 🟰 Empate: ambos usan conductor real sonriendo; el taxi amarillo local es más identitario para Colombia |
| Highlight del H1 | Franja lima sobre «Préstamos en efectivo» | Pastilla blanca sobre «crédito en minutos» | 🟰 Mismo recurso, distinto token; ambos bien |
| CTA hero | «Descarga la app» (lima, pill) | «Simular mi cuota» (mantequilla, scroll a `#simula`) | 🟢 Local mejor: el CTA lleva al valor (cuota) sin instalar nada; inDrive exige la app |
| Nav superior | Logo + «Es» (idioma) + «Menú» hamburguesa (el menú real vive en el drawer) | Logo + «Simular cuota / Beneficios / Preguntas» visibles | 🟢 Local mejor: navegación por anclas directa; inDrive esconde todo tras hamburguesa |

## 2. Casos de uso («para qué sirve el préstamo»)

| Aspecto | inDrive | Plataxi local | Gap |
|---|---|---|---|
| Bloque dedicado | Sí: H2 «Préstamos para necesidades **personales y de negocio**» + bajada («reparación de auto o renovaciones en casa») + mockup de teléfono con «Información del crédito» + collage de fotos | Sí, dentro de `#beneficios`: H2 «Tu crédito, a tu propio ritmo» + copy «SOAT, llantas, mantenimiento o reparaciones imprevistas, con cupos de hasta $1.000.000» + tarjeta demo «TU CRÉDITO ACTIVO / Información del crédito» | 🟰 Ambos tienen bloque de casos + visual de producto; inDrive separa «personal vs negocio» (2 fotos), el local enumera 4 casos del taxi pero sin fotos de apoyo |
| Foto de apoyo | Collage (manos con llaves, surtidor de gasolina) | Ninguna (solo la tarjeta demo) | 🔴 Gap: el local no muestra el dinero en contexto (gasolina, SOAT, taller) |

## 3. Propuesta de valor en tarjetas (feature cards)

| Aspecto | inDrive (4 tarjetas con icono) | Plataxi local | Gap |
|---|---|---|---|
| Monto máximo | «Hasta $1.500.000 — según tu actividad con inDrive» | «cupos de hasta $1.000.000» (copy de `#beneficios`) | 🟡 inDrive comunica tope 50% mayor y criterio (actividad); el local entierra el tope en un párrafo |
| 100% en línea | «sin papeleo, sin espera» | TrustStrip («100% en línea», «Garantías»…) + «Sin fiador ni ir al banco» (testimonio Jhon P.) | 🟰 Cubierto en ambos, pero el local lo dispersa entre TrustStrip y testimonios en vez de una tarjeta propia |
| Límite creciente | «Conduce más para aumentar tu límite y desbloquear nuevas ofertas» | No existe equivalente | 🔴 Gap: mecánica de progresión / niveles (retención) ausente en el local |
| Facilidad de pago | «Tus viajes pagan tu préstamo» (descuento sobre ingresos) | «págalo a tu ritmo», «cuota fija diaria», «La cuota quincenal me cuadra…» (testimonio) | 🟡 inDrive lo hace mecánico y automático; el local lo deja en promesa + testimonio |

## 4. Solicitud / Cómo funciona

| Aspecto | inDrive («Solicitud», 3 pasos + foto lateral) | Plataxi local (`#como-funciona`, «Tu crédito en 3 pasos») | Gap |
|---|---|---|---|
| Paso 1 | «Mira tu oferta — Mantente activo, completa viajes y accede a ofertas» | (ver código `HowItWorks.tsx`; en headless el bloque animado no expuso texto) | 🟡 inDrive ata el paso 1 a **elegibilidad por actividad** (coherente con su modelo); verificar que el local numere 1-simula / 2-solicita / 3-recibe con igual claridad |
| Paso 2 | «Solicita en segundos — respuesta inmediata» | idem anterior | 🟰 |
| Paso 3 | «Obtén tu dinero — directo a tu cuenta bancaria» | idem anterior | 🟡 inDrive dice destino concreto (cuenta bancaria); el local dice «Nequi o cuenta hoy mismo» solo en el CTA final — unificar el destino en el paso 3 |
| CTA del bloque | «Descarga la app» (repite el único CTA global) | — | 🟢 Local mejor: el CTA natural es el propio simulador que está 1 scroll arriba |

## 5. Historias / Testimonios

| Aspecto | inDrive (eyebrow «Historias», 3 tarjetas con foto) | Plataxi local (`Testimonials.tsx`, 3 tarjetas con iniciales) | Gap |
|---|---|---|---|
| H2 | «¿Por qué los conductores prefieren nuestros préstamos?» (prueba social como pregunta) | (título de sección por confirmar en código; las tarjetas existen) | 🟡 El encuadre-pregunta de inDrive convierte mejor que un «Testimonios» genérico |
| Casos | Armando («lo pagas gradualmente, sin sentir el peso»), José Manuel («me sorprendió recibir apoyo financiero»), César («Muy rápido… sin papeleo») | Carlos M. Bogotá («La plata me cayó en menos de una hora»), Liliana R. Medellín («La cuota quincenal me cuadra…»), Jhon P. Cali («Sin fiador… me llegó a Nequi») | 🟢 Local mejor: ciudad + detalle operativo (Nequi, <1h, quincenal) > frases genéricas de inDrive |
| Formato | Foto del conductor | Iniciales en avatar (sin foto) | 🔴 Gap: foto real > iniciales; es el gap visual más barato de cerrar |

## 6. Stats / Cifras

| Aspecto | inDrive | Plataxi local | Gap |
|---|---|---|---|
| Bloque | Sí («Únete a inDrive…»: 3,8M Ciudad a Ciudad · 2,2M Envíos · 44M Viajes · 5,4M Fletes, con letra pequeña metodológica 2024) | No existe | 🔴 Gap: el local no muestra ninguna cifra (ni desembolsos, ni usuarios, ni tiempos). Ojo: las de inDrive son de ride-hailing, no del préstamo — si el local no tiene cifras auditables, mejor un «tiempo medio de desembolso» o nada antes que cifras prestadas |

## 7. FAQ

| Aspecto | inDrive (7 ítems) | Plataxi local (6 ítems, `src/lib/faqs.ts`, tasas vivas del store) | Gap |
|---|---|---|---|
| Preguntas duras | CAT (~94,7%), costos adicionales (garante FGA), pago mínimo, «¿inDrive presta directamente?» (aclara que prestan Parhelio/R2) | Intereses ocultos, Datacrédito, tiempo de desembolso, pagos anticipados sin penalidad, sin historial, pagos por adelantado | 🟢 Local mejor: responde las objeciones colombianas reales (Datacrédito, Nequi, «¿pago algo antes?»); inDrive ni siquiera aclara bien el prestamista en el H1 |
| Transparencia de tasa | CAT explícito con valor | Tasas sincronizadas con el simulador vía store | 🟢 Local mejor (arquitectura): la FAQ no puede mentir porque bebe del mismo store |
| Faltante local | — | Sin equivalente a «¿quién otorga el crédito?» ni «¿qué es el CAT / tasa E.A.?» | 🟡 Añadir 1–2 ítems: quién desembolsa y cuánto cuesta en E.A. (dato ya disponible en el simulador) |

## 8. Footer y confianza legal

| Aspecto | inDrive | Plataxi local | Gap |
|---|---|---|---|
| Columnas | 5 (Servicios, Gana, Seguridad, Impacto, Nosotros) + libro/documental + stores + sociales + «Documentos legales / Cumplimiento» | Marca + contacto + 10 enlaces (3 legales: términos, privacidad, habeas) | 🟡 Esperable por tamaño; el local cumple lo mínimo |
| Placeholders | No | 🔴 «NIT XXX.XXX.XXX-X», «Domicilio pendiente», «+573001234567» visibles | 🔴 Gap crítico: datos ficticios en producción erosionan toda la confianza que el resto construye |
| Disclaimer financiero | «inDrive no es institución financiera… préstamos de Parhelio/R2… Términos de Uso» | Cláusula de inmutabilidad + link a Términos en el simulador | 🟰 Ambos cubren; el local debería añadir quién otorga el crédito junto al CTA |

## 9. Ritmo visual y CTAs

| Aspecto | inDrive | Plataxi local | Gap |
|---|---|---|---|
| Ritmo | Foto limaево: hero foto → crema (casos) → crema (features) → blanco (solicitud) → lima decorativo (historias) → crema (stats) → FAQ blanco → footer escuro. Sin secciones oscuras hasta el footer | Hero foto → simulador blanco → beneficios → cómo-funciona crema → FAQ → CTA final oscuro (`#cta`, textura + glow) → footer negro | 🟰 Ritmos equivalentes; el local concentra el color en el CTA final (bien) |
| CTAs | Uno solo y repetido: «Descarga la app» (hero, solicitud, footer, stores). Cero fricción cognitiva, máxima fricción real (instalar) | «Simular mi cuota» → «Pedir mi crédito» → «Ajustar mi cuota» → WhatsApp asesor. Embudo progresivo | 🟢 Local mejor: cada CTA pide solo el siguiente micro-compromiso; el de inDrive pide instalar la app a ciegas |
| Cookie banner | «Aviso sobre Cookies» tapa ~25% del viewport en desktop y ~45% en mobile | Sin banner visible | 🟢 Local mejor (menos fricción); verificar obligación legal local antes de celebrar |

## 10. Veredicto: qué ya tenemos mejor (no tocar)

1. **Simulador con cuota en vivo** — inDrive no tiene nada parecido en la página: todo su embudo exige descargar la app para ver una oferta. Es la ventaja diferencial #1.
2. **Embudo progresivo web** (simular → pedir → WhatsApp) vs «instala la app o nada».
3. **FAQ con tasas vivas** desde el mismo store del simulador (imposible desincronizar).
4. **Copy de objeciones colombianas** (Datacrédito, Nequi, fiador, <1h) con ciudades reales en testimonios.
5. **Nav por anclas + CTA final oscuro** con doble salida (pedir / ajustar cuota).

## 11. Lista priorizada de cambios (sin inventar datos)

1. **P0 — Reemplazar placeholders del footer** (NIT, domicilio, teléfono) por datos reales o retirar la línea hasta tenerlos. Erosiona todo lo demás.
2. **P1 — Fotos reales en testimonios** (3 retratos de conductores, mismo encuadre que inDrive). Gap visual más barato.
3. **P1 — H1 con audiencia**: «Crédito en minutos para taxistas» o variante; mantener el beneficio y añadir el filtro.
4. **P1 — Foto de caso de uso** (gasolina / SOAT / taller) en `#beneficios`; hoy solo hay tarjeta demo.
5. **P2 — Tarjeta «límite que crece»**: si el producto tiene niveles/cupos progresivos, comunicar la mecánica como inDrive; si no existe, descartar (no inventar).
6. **P2 — Tope visible**: «Hasta $1.000.000» como cifra hero de tarjeta, no enterrado en párrafo. Solo si el tope es real y general.
7. **P2 — FAQ +2 ítems**: quién otorga/desembolsa el crédito y costo en E.A. (reutilizar datos del simulador).
8. **P3 — Paso 3 con destino concreto** («a tu Nequi o cuenta hoy mismo») dentro de `#como-funciona`, no solo en el CTA final.
9. **P3 — H2 de testimonios como pregunta** («¿Por qué los conductores prefieren Plataxi?»).
10. **P3 — Evaluar bloque de cifras** solo con datos auditables propios (desembolsos, tiempo medio); nada de cifras de ride-hailing prestadas.
