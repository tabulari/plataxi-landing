import Image from 'next/image';
import { HeroAnim } from './HeroAnim';
import { HeroActiveNotice } from './HeroActiveNotice';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full min-h-[620px] sm:min-h-[640px] md:min-h-[640px] lg:h-[88vh] lg:min-h-[640px] lg:max-h-[800px] xl:max-h-[830px] overflow-hidden flex items-end sm:items-center bg-secondary-surface"
    >
      <Image
        src="/hero-conductor-acordeon.jpeg"
        alt="Taxista sonriendo con pulgar arriba y monumento del acordeón vallenato al fondo"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[66%_50%] md:object-[82%_50%] lg:object-[84%_50%] stack:object-[60%_60%]"
      />

      {/* Scrim: subtle contrast boost for text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/20 sm:bg-black/20 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/45 lg:via-black/20 lg:to-transparent pointer-events-none"
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
