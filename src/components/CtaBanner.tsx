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
    const eyebrow = panel.querySelector('[data-cta="eyebrow"]');
    const heading = panel.querySelector('[data-cta="heading"]');
    const subhead = panel.querySelector('[data-cta="subhead"]');
    const actionBlock = panel.querySelector('[data-cta="action-block"]');
    const sheen = panel.querySelector('.cta-sheen');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // 1. Panel entrance
    tl.fromTo(
      panel,
      { y: 32, scale: 0.97, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.7 },
      0,
    );

    // 2. Eyebrow, Heading & Subhead
    if (eyebrow) tl.fromTo(eyebrow, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.2);
    if (heading) tl.fromTo(heading, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.3);
    if (subhead) tl.fromTo(subhead, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.45);

    // 3. Action Block
    if (actionBlock) {
      tl.fromTo(
        actionBlock,
        { y: 18, scale: 0.95, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.4)' },
        0.55,
      );
    }

    // 4. One-shot Sheen Sweep
    if (sheen) {
      gsap.set(sheen, { xPercent: -270 });
      tl.to(sheen, { xPercent: 270, duration: 0.9, ease: 'power2.inOut' }, 0.75);
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="cta"
      aria-labelledby="cta-heading"
      className="bg-primary-dark text-white py-16 lg:py-24 relative z-10 -mt-2 overflow-hidden"
    >
      {/* Background Dot-Grid Texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient Green Light Bloom */}
      <div
        className="absolute left-1/3 top-10 -translate-x-1/2 w-80 h-80 cta-glow cta-glow--green pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-container px-6 relative pb-6 lg:pb-10">
        <div
          ref={panelRef}
          data-cta="panel"
          className="relative flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 rounded-3xl bg-white/[0.05] ring-1 ring-white/12 p-10 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          <span className="cta-sheen" aria-hidden="true" />

          {/* Left Column: Pure, Saturated Value Anchor */}
          <div className="flex-1 min-w-0 relative space-y-5 text-left">
            <p
              data-cta="eyebrow"
              className="text-xs font-semibold uppercase tracking-widest text-green"
            >
              Comienza ahora
            </p>

            <h2
              id="cta-heading"
              data-cta="heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-display tracking-tight text-white leading-[1.18] mb-2"
            >
              Tu dinero en minutos, <br className="hidden sm:inline" />
              <span className="inline-block bg-secondary-surface text-primary-dark px-3 py-1 rounded-xl mt-1.5 shadow-2xs">
                sin fiador ni trámites.
              </span>
            </h2>

            <p
              data-cta="subhead"
              className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg pt-1"
            >
              Solicita 100% en línea con tu cédula y recibe el desembolso directo en tu cuenta o billetera digital hoy mismo.
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
              className="w-full min-h-[54px] h-14 bg-green text-ink font-bold shadow-[0_12px_28px_-6px_rgba(255,221,0,0.35),0_8px_10px_-6px_rgba(0,0,0,0.4)] hover:bg-green-bright hover:scale-[1.01] active:scale-[0.98] transition-all text-base rounded-2xl border-0 flex items-center justify-center gap-2"
            >
              <span>Solicitar crédito</span>
            </ApplyButton>

            {/* Secondary: Minimalist Floating Trigger */}
            <div className="text-center">
              <ScrollButton
                variant="ghost-dark"
                target="#simula"
                className="w-full min-h-[48px] h-12 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 border-0 rounded-xl"
              >
                <span>Simular cuota primero</span>
                <span className="text-white/40 font-normal">↑</span>
              </ScrollButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
