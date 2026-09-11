import Image from 'next/image';
import { ScrollButton } from './ScrollButton';
import { HeroAnim } from './HeroAnim';
import { HeroActiveNotice } from './HeroActiveNotice';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full min-h-[500px] sm:min-h-[560px] md:min-h-[600px] lg:h-[72vh] lg:min-h-[600px] lg:max-h-[680px] xl:max-h-[720px] overflow-hidden flex items-center bg-primary-dark"
    >
      <Image
        src="/hero-updated.jpeg"
        alt="Taxista colombiano con Plataxi"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '75% 38%' }}
      />

      {/* Scrim: calibrated for WCAG AA compliance (4.5:1 paragraph, 3:1 h1) over bright taxi highlights */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/85 lg:via-black/65 lg:to-black/20"
      />

      <div className="relative z-10 w-full mx-auto max-w-container px-6 pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-14 lg:pb-10 -translate-y-2 sm:-translate-y-3 lg:-translate-y-6">
        <HeroAnim>
          <div className="max-w-2xl space-y-5 text-center sm:text-left">
            <HeroActiveNotice />

            {/* Headline — white pill on yellow taxi for contrast, weight reduced so h1 doesn't dominate h2 */}
            <h1
              id="hero-heading"
              data-hero-anim
              className="text-hero font-display font-semibold tracking-[-0.015em] text-white"
            >
              Soluciona tu día,{' '}
              <mark className="inline-block bg-background text-primary-dark px-2.5 py-0.5 rounded-lg shadow-xs">
                crédito en minutos
              </mark>
            </h1>

            <p data-hero-anim className="text-sm sm:text-base text-white leading-relaxed max-w-md mx-auto sm:mx-0">
              Solo con tu cédula y tu celular. Elige el monto que necesitas hoy y págalo a tu ritmo con cuota fija diaria.
            </p>

            {/* Single focused CTA — inDrive: 48px mobile / 64px desktop, 20-26px radius, yellow on dark */}
            <div data-hero-anim data-slot="hero-ctas" className="pt-1 flex justify-center sm:justify-start">
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
