import Image from 'next/image';
import { HeroAnim } from './HeroAnim';
import { HeroActiveNotice } from './HeroActiveNotice';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full min-h-[520px] sm:min-h-[580px] md:min-h-[620px] lg:h-[78vh] lg:min-h-[640px] lg:max-h-[750px] xl:max-h-[780px] overflow-hidden flex items-center bg-secondary-surface"
    >
      <Image
        src="/hero-update-image.jpeg"
        alt="Taxista colombiano con Plataxi"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_55%]"
      />

      {/* Scrim: subtle contrast boost for text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/35 sm:bg-black/30 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/60 lg:via-black/30 lg:to-transparent pointer-events-none"
      />

      <div className="relative z-10 w-full mx-auto max-w-container px-6 pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-16 lg:pb-12 -translate-y-1 sm:-translate-y-2 lg:-translate-y-2">
        <HeroAnim>
          <div className="max-w-2xl space-y-5 text-center sm:text-left">
            <HeroActiveNotice />

            {/* Headline */}
            <h1
              id="hero-heading"
              data-hero-anim
              className="text-hero lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            >
              <span className="block">Soluciona tu día,</span>
              <mark className="inline-block bg-primary-brand text-primary-dark px-3 sm:px-4 py-0.5 sm:py-1 rounded-none shadow-xs font-bold mt-1 sm:mt-2">
                crédito en minutos
              </mark>
            </h1>
          </div>
        </HeroAnim>
      </div>
    </section>
  );
}
