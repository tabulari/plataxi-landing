import { ShieldCheckIcon, LockIcon } from './icons';

/**
 * Trust strip.
 *
 * Sits directly above the closing CTA so the reassurances land next to the
 * conversion point.
 *
 * This began as a stats block carrying the figures displaced from the hero, but
 * every one of them restated something already on the page: the credit limit
 * became a Benefits card, "respuesta en minutos" is that card's body copy, and
 * "100% en línea" is the first badge below. Repeating them read as padding, so
 * only the two claims that appear nowhere else survive.
 */
export function TrustStrip() {
  return (
    <section aria-label="Garantías" className="mt-16 md:mt-32">
      <div className="mx-auto max-w-container px-6 flex justify-center">
        <div className="rounded-lg bg-surface-card px-6 py-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ShieldCheckIcon size={18} className="text-ink shrink-0" />
            Estudio 100% digital y gratuito
          </span>
          <span className="hidden sm:inline text-border" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-2">
            <LockIcon size={18} className="text-ink shrink-0" />
            Datos cifrados y protegidos
          </span>
        </div>
      </div>
    </section>
  );
}
