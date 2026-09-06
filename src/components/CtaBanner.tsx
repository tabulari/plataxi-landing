'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ApplyButton } from './ApplyButton';
import { ScrollButton } from './ScrollButton';

export function CtaBanner() {
  const containerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !panelRef.current) return;

    const panel = panelRef.current;
    const heading = panel.querySelector('[data-cta="heading"]');
    const subhead = panel.querySelector('[data-cta="subhead"]');
    const actionBlock = panel.querySelector('[data-cta="action-block"]');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        once: true,
      },
    });

    // 1. Panel entrance — subtle lift, no scale distortion
    tl.fromTo(
      panel,
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4 },
      0,
    );

    // 2. Heading & Subhead
    if (heading) tl.fromTo(heading, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, 0.1);
    if (subhead) tl.fromTo(subhead, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, 0.18);

    // 3. Action Block — clean, firm entrance without toy bounce
    if (actionBlock) {
      tl.fromTo(
        actionBlock,
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.35 },
        0.25,
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="cta"
      aria-labelledby="cta-heading"
      className="dot-grid bg-primary-dark text-white py-16 lg:py-24 relative z-10 -mt-2 overflow-hidden"
    >
      <div className="mx-auto max-w-container px-6 relative pb-6 lg:pb-10">
        <div
          ref={panelRef}
          data-cta="panel"
          className="relative flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 rounded-3xl bg-white/[0.05] ring-1 ring-white/12 p-6 sm:p-10 lg:p-16 backdrop-blur-xl shadow-lg overflow-hidden"
        >
          {/* Left Column: Pure, Saturated Value Anchor */}
          <div className="flex-1 min-w-0 relative space-y-5 text-left">
            <h2
              id="cta-heading"
              data-cta="heading"
              className="text-section font-display font-bold text-white"
            >
              Plata lista para rodar,{' '}
              <mark className="inline-block bg-primary-brand text-primary-dark px-3 py-1 rounded-lg shadow-sm">
                sin filas ni enredos.
              </mark>
            </h2>

            <p
              data-cta="subhead"
              className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg pt-1"
            >
              Pide desde tu celular con tu cédula y te llega el dinero directo a tu Nequi o cuenta hoy mismo.
            </p>
          </div>

          {/* Right Column: VARIANT B — Titanium Light Capsule */}
          <div
            data-cta="action-block"
            className="flex flex-col justify-center items-stretch gap-3 w-full sm:w-[310px] lg:shrink-0 lg:border-l lg:border-white/10 lg:pl-10 relative"
          >
            {/* Primary: Brilliant Pure White Titanium Capsule with Double Rim */}
            <ApplyButton
              origin="cta_banner"
              size="lg"
              className="w-full min-h-[54px] h-14 bg-green text-ink font-bold shadow-[0_12px_28px_-6px_rgba(246,216,96,0.35),0_8px_10px_-6px_rgba(17,17,16,0.4)] hover:bg-green-bright hover:scale-[1.01] active:scale-[0.98] transition-all text-base rounded-2xl border-0 flex items-center justify-center gap-2"
            >
              <span>Pedir mi crédito</span>
            </ApplyButton>

            {/* Secondary: Minimalist Floating Trigger */}
            <div className="text-center">
              <ScrollButton
                variant="ghost-dark"
                target="#simula"
                className="w-full min-h-[48px] h-12 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 border-0 rounded-xl"
              >
                <span>Ajustar mi cuota</span>
                <span className="text-white/40 font-normal">↑</span>
              </ScrollButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
