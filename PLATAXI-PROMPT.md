# Prompt reutilizable — Landing Page Plataxi

Usa este prompt en cualquier herramienta IA (v0, Lovable, Figma Make, etc.) para
generar o regenerar la landing de Plataxi con el look correcto.

---

## Prompt

Crea una **landing page moderna para "Plataxi"**, una plataforma de microcrédito
digital dirigida a conductores y taxistas en Colombia.

**Referencia visual**: inDrive.com — moderno, limpio, mucho espacio en blanco,
esquinas muy redondeadas, un solo color de acento vibrante con tipografía sans-serif robusta.

---

### Paleta de colores (mono-acento)

| Token | Hex | Uso |
|---|---|---|
| Acento | `#FFDD00` | Rellenos, highlights, fondos de íconos, CTA primario — **siempre con texto `#151515` encima** |
| Fondo claro | `#FFFFFF`, `#F7F7F5` | Superficies principales |
| Crema | `#FFFEE9` | Secciones alternadas |
| Oscuro | `#151515` | Texto, estructura, footer, botones secundarios |
| Muted | `#797979` | Texto atenuado, labels |
| Éxito (funcional) | `#1E9E55` | Solo para estados de éxito / confirmación — NO como acento de marca |

**Regla crítica de contraste**: el amarillo `#FFDD00` NUNCA se usa como color de
texto (ratio < 2:1 con blanco, ilegible). Texto sobre fondo amarillo siempre en
`#151515`. Texto sobre fondos blancos/cremas siempre en `#151515` o `#797979`.

---

### Tipografía

- **Familia**: Roboto (Google Fonts)
- **Pesos**: Light (300) · Regular (400) · Medium (500) · Bold (700) · Black (900)
- Títulos: Roboto Black / Bold, tracking apretado (`letter-spacing: -0.02em`)
- Cuerpo: Roboto Regular / Medium, interlineado confortable (`line-height: 1.6`)

---

### Secciones (en orden de aparición)

**1. Nav** — sticky, fondo blanco traslúcido con blur.
Wordmark "Plataxi" (tipográfico, bold, letra P con fondo amarillo redondeado como marca).
Enlace "Cómo funciona", "Preguntas". Botón CTA amarillo "Simular crédito" con texto negro.

**2. Hero** — layout split 50/50 en desktop.
- Izquierda: badge "Crédito digital en Colombia", título grande (**"Tu crédito, aprobado en minutos"**, con "aprobado en minutos" en fondo amarillo como highlight de texto), subtítulo ("Simula tu cuota, solicita 100% en línea y recibe respuesta al instante."), CTA primario amarillo + CTA secundario borde negro. Fila de stats: `$1.000.000 / Monto máximo` · `Minutos / Respuesta` · `100% / En línea`.
- Derecha: ilustración o mockup de teléfono con la app. Formas decorativas amarillas en el fondo.

**3. Simulador de crédito** *(preservar lógica existente, solo cambiar estilo)*
Sección con fondo `#F7F7F5`. Control interactivo:
- Slider + input + chips de preset de monto (300k / 500k / 1M).
- Chips de plazo (3/6/9/12/18/24 meses).
- Chips de frecuencia (Mensual / Quincenal).
- Panel de resultados: cuota estimada (grande, negrita), total con intereses, tasa m.v. y TEA.
- Botón "Solicitar crédito" amarillo.
La lógica: `cuota = P × i / (1 − (1+i)^−n)` con `i = 2.6% mensual`, `n = terminos × 2` para quincenal.

**4. Beneficios / Tipos de crédito** — 3 tarjetas blancas en grid.
Cada tarjeta: ícono emoji en cuadro amarillo (44×44, rounded-2xl), título bold, descripción breve.
- ⚡ "Crédito exprés" — Respuesta en minutos. Sin esperas ni filas.
- 🤝 "Sin codeudor" — Solo cédula y soporte de ingresos.
- 📅 "Pagos flexibles" — Mensual o quincenal. Tú decides el plazo.

**5. Cómo funciona** — pasos numerados horizontales (en desktop).
1 → Simula tu cuota. 2 → Completa tu solicitud. 3 → Recibe el dinero.
Números grandes en amarillo, línea conectora entre pasos.

**6. Testimonios / Impacto** — sección fondo crema `#FFFEE9`, 3 tarjetas blancas.
Cada tarjeta: estrellas (5/5, amarillas), cita en cursiva, avatar de iniciales (fondo amarillo + texto negro), nombre y ciudad. Título de sección con highlight amarillo.

**7. FAQ** — acordeón a 2 columnas. Preguntas frecuentes sobre tasas, plazos,
documentos, desembolso. Acento amarillo en el ítem activo.

**8. CTA final** — sección fondo `#151515` (oscuro). Panel redondeado semitransparente.
- Izquierda: eyebrow "Comienza ahora" en amarillo, título "Tu dinero en minutos, sin fiador ni trámites." (frase clave en highlight amarillo), subtítulo.
- Derecha: botón primario amarillo "Solicitar crédito" + botón ghost "Simular cuota primero".

**9. Footer** — fondo `#151515`, texto blanco.
Wordmark Plataxi (variante blanca). Tagline breve. Redes sociales (íconos circulares).
Columnas: Plataforma (Términos, Privacidad, Datos), Soporte (Ayuda, Contacto, PQRS).
Barra legal: "© 2026 Plataxi. Todos los derechos reservados. Ley 1581 de 2012."

---

### Divisores de sección

Olas SVG animadas suavemente (GSAP sine.inOut) para transiciones entre secciones.
Al transicionar hacia `#151515`, la ola secundaria usa `#FFDD00` con opacidad 0.22
para dar profundidad visual sin romper el contraste.

---

### Consideraciones de calidad

- **Responsive** mobile-first, breakpoints sm:600 md:720 lg:1120.
- **Accesible**: contraste AA (WCAG 2.1), foco visible (outline 2px `#151515`), roles ARIA.
- **Microanimaciones**: GSAP `ScrollTrigger` · `fromTo(y: 24, autoAlpha: 0)` en cards al entrar.
- **Fuentes**: cargar Roboto vía `next/font/google` con pesos 300/400/500/700/900.
- **SEO**: `<title>Plataxi — Crédito digital 100% en línea</title>`, OG tags, JSON-LD `FinancialService`.
