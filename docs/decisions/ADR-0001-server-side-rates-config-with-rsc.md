# ADR-0001 — Leer la configuración financiera con React Server Components (server-side), no con fetch en cliente

- **Estado:** Aceptado
- **Fecha:** 2026-09-07
- **Ámbito:** `plataxi-landing` (simulador de crédito)
- **Servicios relacionados:** Credalia `core` (productor del contrato `GET /api/v1/sessions/rates-config`), Credalia `backoffice` (escribe la config)

## Contexto

El simulador de la landing debe mostrar la **configuración financiera vigente** que un
administrador edita en el Backoffice de Credalia: tasa mensual, monto mínimo/máximo y plazos
disponibles. Esa configuración es propiedad de `core`:

- El admin la escribe con `POST /api/v1/admin/settings`.
- `core` la valida (`monthly_interest_rate > 0`, `max_amount > min_amount`, `term_options_months` no vacío) y la persiste en la tabla `financial_settings`, marcando la fila vigente con `is_active`.
- `core` la expone públicamente (sin auth) en `GET /api/v1/sessions/rates-config`.

**El backoffice y la landing nunca se comunican directamente.** Se encuentran en la base de datos
de `core`: el backoffice escribe, la landing lee. No hay push, webhook ni redeploy entre ellos.

### Cómo se leía antes (y por qué no bastaba)

El `SimulatorProvider` (Client Component) arrancaba con valores estáticos de `config.ts`
(`STATIC_RATES`) y, ya en el navegador, hacía un `fetch` en un `useEffect` a un proxy
same-origin `/api/rates-config`. Problemas:

1. **Parpadeo:** el primer render mostraba los valores estáticos y luego "saltaba" a los de core.
2. **CORS:** la lectura desde el navegador obligó a mantener un proxy `/api/rates-config` solo para evitar el bloqueo de CORS.
3. **SEO / primer HTML:** los valores reales no estaban en el HTML servido; llegaban después de hidratar.
4. **Riesgo de desincronización:** un build desplegado con lógica de plazos hardcodeada podía ignorar `term_options_months` aunque core lo devolviera correcto.

## Decisión

Leer `rates-config` **en el servidor, dentro del Root Layout (React Server Component)**, por
request, y **sembrar** el `SimulatorProvider` con esos valores vía una prop `initialRates`. Se
elimina el `fetch` en cliente.

- `src/app/layout.tsx` (Server Component): pasa a `async`, declara `export const dynamic = "force-dynamic"` y hace `await loadRatesConfig(config.ratesConfigEndpoint)` — lectura server-a-server contra `core`. Pasa el resultado como `initialRates` al provider. Si `core` no responde, `initialRates` es `undefined` y el provider cae a `STATIC_RATES`.
- `src/components/simulator-store.tsx` (Client Component): el provider acepta `initialRates`, inicializa su estado (`rates`, `amount`, `term`) a partir de esa config y **ya no hace fetch en cliente**. La interactividad (sliders de monto/plazo/frecuencia y el recálculo de la cuota) sigue viviendo aquí — patrón híbrido RSC + Client Component.

### Cómo se "visualiza" el cambio en la landing (el flujo completo)

```
1. Admin guarda en Backoffice   → POST /admin/settings → core valida → financial_settings.is_active
2. Un visitante abre/recarga la landing
3. RootLayout (RSC) se ejecuta en el servidor (force-dynamic)
   → await loadRatesConfig(core /rates-config) → obtiene la fila vigente
4. Pasa initialRates al SimulatorProvider → el Simulator renderiza tasa/montos/plazos
   → el valor del admin ya viene en el HTML servido, sin fetch en cliente y sin CORS
```

El cambio aparece **sin redeploy**: cada carga de la landing vuelve a leer `core`.

## Por qué RSC (y no las otras opciones)

| Opción | Veredicto |
|---|---|
| **RSC server-side (elegida)** | HTML correcto al primer render (sin parpadeo), sin CORS (server-a-server), valores presentes para SEO/redes, `core` como única fuente de verdad, sin redeploy para cambiar valores. |
| Fetch en cliente (lo anterior) | Funciona, pero con parpadeo, dependía de un proxy por CORS y no dejaba los valores en el HTML. |
| Webhook del backoffice → redeploy en Vercel | Rechazada para datos: un redeploy reconstruye la app; solo tiene sentido para **cambios de código**, no para un valor por-registro. |
| ISR (`revalidate = N`) | Alternativa válida si se quiere mantener la landing cacheada y aceptar hasta N segundos de retardo. Es un simple ajuste sobre esta misma decisión (cambiar `force-dynamic` por `revalidate`). |

## Consecuencias

**Positivas**
- La configuración vigente del admin es visible en **cada carga**, sin redeploy.
- Se elimina la dependencia de CORS y el `fetch` en cliente del simulador.
- Los valores viajan en el HTML inicial → mejor SEO y sin parpadeo.

**Costos / notas**
- El Root Layout pasa a **render dinámico** (SSR por request) para toda la app. Aceptable para esta landing; si se prioriza el cacheo estático, migrar a ISR (`revalidate`).
- Requiere que `NEXT_PUBLIC_RATES_CONFIG_ENDPOINT` apunte al `core` real en el entorno desplegado. Si falla, se sirve `STATIC_RATES` (degradación segura, no error).
- El proxy `/api/rates-config` queda sin uso por el simulador; se conserva por si otro consumidor lo necesita.

## Fuera de alcance (límite de gobernanza)

Las tarifas de las cuatro modalidades de pago (diaria/semanal/quincenal/mensual) están
**congeladas en `core`** por `ADR-0066 / DOMAIN-009` y **no** son editables desde el backoffice.
Esta decisión solo cubre tasa, montos y plazos, que sí son configurables.

## Referencias

- `src/app/layout.tsx`, `src/components/simulator-store.tsx`, `src/lib/rates-config.ts`
- Credalia `core`: `GET /api/v1/sessions/rates-config` (IP-028), tabla `financial_settings`
- React — Server Components: https://es.react.dev/reference/rsc/server-components
