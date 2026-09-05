import Image from 'next/image';
import { ScrollButton } from './ScrollButton';
import { HeroAnim } from './HeroAnim';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full h-[580px] sm:h-[650px] lg:h-[720px] overflow-hidden flex items-center bg-primary-dark"
    >
      <Image
        src="/taxista.jpeg"
        alt="Taxista colombiano con Plataxi"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '75% center' }}
      />

      {/* Scrim: indrive parity 40-45% avg — reveals driver/plate while keeping white AA (6.5:1 on 45%). Darker 60/80 hid warmth & plate. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/60 lg:to-black/30"
      />

      <div className="relative z-10 w-full mx-auto max-w-container px-6 py-12 lg:py-16">
        <HeroAnim>
          <div className="max-w-2xl space-y-5">
            {/* Headline — inDrive: text-4xl md:text-6xl font-bold, highlight via <mark> */}
            <h1
              id="hero-heading"
              data-hero-anim
              className="text-hero font-display font-bold text-white"
            >
              Soluciona tu día,{' '}
              <mark className="inline-block bg-primary-brand text-primary-dark px-3 py-1 rounded-lg">
                crédito en minutos
              </mark>
            </h1>

            <p data-hero-anim className="text-base sm:text-lg text-white/90 leading-relaxed max-w-lg">
              Sin nómina ni fiador. Pide desde $100.000 hasta $1.000.000 y te llega el dinero directo a tu Nequi hoy mismo.
            </p>

            {/* Single focused CTA — inDrive: 48px mobile / 64px desktop, 20-26px radius, yellow on dark */}
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
