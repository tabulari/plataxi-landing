'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  n: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Pide desde tu celular en 3 minutos',
    body: 'Solo necesitas tu cédula y extracto reciente de Nequi o cuenta. 100% digital y sin filas.',
  },
  {
    n: '02',
    title: 'Conoce tu cuota fija',
    body: 'Sin letra chica ni cobros ocultos: ves el valor exacto que pagarás en el plazo que elijas.',
  },
  {
    n: '03',
    title: 'Recibe tu dinero hoy',
    body: 'Aceptas en tu pantalla y te transferimos directo a Nequi, DaviPlata o tu cuenta bancaria.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const mm = gsap.matchMedia();
      // 4. Reduce: asegura contenido visible sin animar (no queda autoAlpha:0)
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const root = containerRef.current;
        if (!root) return;
        gsap.set(root.querySelectorAll('[data-hiw="header"] > *, [data-hiw="step"]'), {
          autoAlpha: 1,
          y: 0,
          clearProps: 'transform',
        });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = containerRef.current;
        if (!root) return;
        const header = root.querySelectorAll<HTMLElement>('[data-hiw="header"] > *');
        const items = root.querySelectorAll<HTMLElement>('[data-hiw="step"]');
        if (!header.length && !items.length) return;
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            once: true,
          },
        });
        if (header.length) {
          tl.fromTo(header, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.05 }, 0);
        }
        if (items.length) {
          tl.fromTo(items, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06 }, 0.08);
        }
        return () => tl.kill();
      });
      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="como-funciona"
      aria-labelledby="hiw-heading"
      className="mt-16 md:mt-32"
    >
      <div className="mx-auto max-w-container px-6">
        <div data-hiw="header" className="mb-12 lg:mb-16 text-center max-w-2xl mx-auto space-y-2">
          <h2 id="hiw-heading" className="text-section font-display font-bold text-navy">
            Tu crédito en 3 pasos
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Un proceso transparente, 100% digital y sin intermediarios.
          </p>
        </div>

        {/* Connected Steps Journey — Mathematical Alignment, Zero Clutter */}
        <ol aria-label="Pasos para obtener tu crédito" className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 lg:gap-12 max-w-5xl mx-auto">
          {STEPS.map((s, idx) => {
            const isLast = idx === STEPS.length - 1;
            return (
              <li
                key={s.n}
                data-hiw="step"
                aria-posinset={idx + 1}
                aria-setsize={STEPS.length}
                className="flex flex-row md:flex-col items-start text-left relative gap-4 sm:gap-6 md:gap-0"
              >
                {/* Node with Continuous Rail Line */}
                <div className="flex flex-col md:flex-row items-center md:w-full md:mb-5 relative self-stretch md:self-auto shrink-0">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary-brand bg-white text-primary-dark font-display font-bold text-sm shrink-0 tabular-nums shadow-xs z-10">
                    <span className="sr-only">Paso </span>
                    {s.n}
                  </span>

                  {/* Vertical connector on mobile (< md) — altura fija, no flex-1 dependiente del contenido */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="w-0.5 h-8 bg-border my-2 rounded-full md:hidden shrink-0"
                    />
                  )}

                  {/* Horizontal rail on desktop (md+) — usa right negativo en vez de calc frágil */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="hidden md:block absolute top-1/2 -translate-y-1/2 left-10 right-[-2rem] lg:right-[-3rem] h-0.5 bg-border/80"
                    />
                  )}
                </div>

                {/* Clean Content Details: Title + 1 Concise Sentence */}
                <div className={`text-left pt-1 md:pt-0 ${isLast ? 'pb-2' : 'pb-8 md:pb-0'} md:pr-4`}>
                  <h3 className="text-lg md:text-xl font-bold text-navy tracking-tight leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-2">
                    {s.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
