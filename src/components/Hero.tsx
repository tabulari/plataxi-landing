import Image from 'next/image';
import { ScrollButton } from './ScrollButton';
import { HeroAnim } from './HeroAnim';
import { HeroActiveNotice } from './HeroActiveNotice';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full min-h-[520px] sm:min-h-[580px] md:min-h-[620px] lg:h-[78vh] lg:min-h-[640px] lg:max-h-[750px] xl:max-h-[780px] flex items-center bg-primary-dark"
    >
      <Image
        src="/hero-updated.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '75% 36%' }}
      />

      {/* Scrim: calibrated for WCAG AA compliance (4.5:1 paragraph, 3:1 h1) over bright taxi highlights */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-primary-dark/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-primary-dark/85 lg:via-primary-dark/65 lg:to-primary-dark/20 pointer-events-none"
      />

      <div className="relative z-10 w-full mx-auto max-w-container px-[max(1.5rem,env(safe-area-inset-inline))] pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-16 lg:pb-12">
        <HeroAnim>
          <div className="max-w-2xl space-y-3 text-start">
            <HeroActiveNotice />

            {/* Headline — white pill on yellow taxi for contrast, weight reduced so h1 doesn't dominate h2 */}
            <h1
              id="hero-heading"
              data-hero-anim
              className="text-hero font-display font-semibold tracking-[-0.015em] text-white text-balance"
            >
              Soluciona tu día,{' '}
              <mark className="inline-block bg-background text-primary-dark px-2.5 py-0.5 rounded-lg shadow-xs [box-decoration-break:clone]">
                crédito en minutos
              </mark>
            </h1>

            <p data-hero-anim className="text-base sm:text-base text-white leading-relaxed max-w-md text-pretty break-words">
              Solo con tu cédula y tu celular. Elige el monto y págalo con cuota fija diaria.
            </p>

            {/* Single focused CTA — inDrive: 48px mobile / 64px desktop, 20-26px radius, yellow on dark */}
            <div data-hero-anim data-slot="hero-ctas" className="pt-6 flex justify-start">
              <ScrollButton
                variant="default"
                size="lg"
                target="#simula"
                className="w-full sm:w-auto min-h-[48px] lg:min-h-[56px] px-8 rounded-lg font-bold bg-primary-brand text-primary-dark hover:bg-primary-brand/90 transition-[transform,opacity,background-color,box-shadow,border-color] active:scale-[0.96] shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
              >
                Simular cuota
              </ScrollButton>
            </div>
          </div>
        </HeroAnim>
      </div>
    </section>
  );
}
