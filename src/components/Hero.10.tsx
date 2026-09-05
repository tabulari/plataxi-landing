import Image from 'next/image';
import { ScrollButton } from './ScrollButton';
import { HeroAnim } from './HeroAnim';

/**
 * Hero 10.0 variant — indrive `i16prdka picture` parity
 * - `min-h-[100dvh]` capped at 720px (vs fixed 580/650/720) to guarantee above-fold CTA on 667px iPhone
 * - `picture` with mobile/desktop `srcSet` (Next `sizes` already emits 640→3840, this makes the crop explicit)
 * Keep `Hero.tsx` ship-ready (9.7) — use this file only for A/B to close the -0.3 gap.
 */
export function Hero10() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full min-h-[calc(100dvh-68px)] sm:min-h-[650px] lg:min-h-[720px] max-h-[800px] overflow-hidden flex items-center bg-primary-dark"
    >
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/taxista.jpeg 640w, /taxista.jpeg 1080w, /taxista.jpeg 1920w"
          sizes="100vw"
        />
        <Image
          src="/taxista.jpeg"
          alt="Taxista colombiano con Plataxi"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '75% center' }}
        />
      </picture>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/55 lg:to-black/20"
      />

      <div className="relative z-10 w-full mx-auto max-w-container px-6 py-12 lg:py-16">
        <HeroAnim>
          <div className="max-w-2xl space-y-5">
            <div data-hero-anim>
              <span className="inline-flex items-center h-10 px-5 rounded-pill text-sm md:text-base font-medium bg-background text-primary-dark shadow-sm">
                Hecho para taxistas colombianos
              </span>
            </div>
            <h1 id="hero-heading" data-hero-anim className="text-hero font-display font-bold text-white">
              Plata pa&apos;l día a día,{' '}
              <mark className="inline-block bg-primary-brand text-primary-dark px-3 py-1 rounded-lg">
                aprobada en minutos
              </mark>
            </h1>
            <p data-hero-anim className="text-base sm:text-lg text-white/90 leading-relaxed max-w-lg">
              Sin nómina ni fiador. Pide desde $100.000 hasta $1.000.000 y te llega la plata directo a tu Nequi hoy mismo.
            </p>
            <div data-hero-anim className="pt-1">
              <ScrollButton
                variant="default"
                size="lg"
                target="#simula"
                className="w-full sm:w-auto min-h-[48px] lg:min-h-[56px] px-8 rounded-lg font-bold bg-primary-brand text-primary-dark hover:bg-primary-brand/90 transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                Simular mi cuota
              </ScrollButton>
            </div>
          </div>
        </HeroAnim>
      </div>
    </section>
  );
}
