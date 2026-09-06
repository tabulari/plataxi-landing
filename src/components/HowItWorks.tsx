'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Step {
  n: string;
  phase: string;
  title: string;
  body: string;
  chip: string;
}

const STEPS: Step[] = [
  {
    n: '01',
    phase: 'Solicitud digital',
    title: 'Pide desde tu celular en 3 minutos',
    body: 'Solo necesitas ser mayor de 18 años, tu cédula y tu extracto reciente de Nequi o cuenta. 100% digital y sin filas.',
    chip: 'Cédula vigente + Nequi o cuenta',
  },
  {
    n: '02',
    phase: 'Aprobación inmediata',
    title: 'Conoce tu cuota fija',
    body: 'Evaluamos tu perfil al instante. Ves el valor exacto que pagarás en la fecha y plazo elegidos, sin letra chica.',
    chip: 'Cero cobros previos ni pólizas ocultas',
  },
  {
    n: '03',
    phase: 'Desembolso en línea',
    title: 'Recibe tu dinero hoy',
    body: 'Aceptas las condiciones en tu pantalla y te transferimos directamente a tu cuenta hoy mismo.',
    chip: 'Nequi · DaviPlata · Bancolombia',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const header = containerRef.current?.querySelectorAll<HTMLElement>('[data-hiw="header"] > *');
        const items = containerRef.current?.querySelectorAll<HTMLElement>('[data-hiw="step"]');
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        });
        if (header?.length) {
          tl.fromTo(header, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.05 }, 0);
        }
        if (items?.length) {
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
            Un proceso transparente, guiado y 100% digital. Sin intermediarios ni papeleo físico.
          </p>
        </div>

        {/* Unified Progress Rail Stepper: Responsive Vertical Spine on Mobile, Horizontal Rail on Desktop */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 lg:gap-12 max-w-5xl mx-auto">
          {STEPS.map((s, idx) => {
            const isLast = idx === STEPS.length - 1;
            return (
              <li
                key={s.n}
                data-hiw="step"
                className="flex flex-row md:flex-col items-start text-left relative gap-4 sm:gap-5 md:gap-0"
              >
                {/* Node & Connector Rail: Vertical spine on mobile / Horizontal progress rail on desktop */}
                <div className="flex flex-col md:flex-row items-center md:w-full md:mb-5 relative self-stretch md:self-auto shrink-0">
                  <span className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-primary-brand bg-white text-primary-dark font-display font-bold text-xs md:text-sm shrink-0 tabular-nums shadow-xs z-10">
                    <span className="sr-only">Paso </span>
                    {s.n}
                  </span>

                  {/* Vertical line on mobile (< md) */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="w-px flex-1 min-h-[56px] bg-border my-2.5 rounded-full md:hidden"
                    />
                  )}

                  {/* Horizontal line on desktop (md+) */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="hidden md:block h-px flex-1 bg-border/80 ml-3.5 -mr-3.5 lg:-mr-6"
                    />
                  )}
                </div>

                {/* Content Details */}
                <div className={`text-left pt-0.5 md:pt-0 ${isLast ? 'pb-2' : 'pb-8 md:pb-0'} md:pr-2`}>
                  <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    {s.phase}
                  </span>

                  <h3 className="text-lg md:text-xl font-bold text-navy tracking-tight leading-snug mt-1">
                    {s.title}
                  </h3>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-1.5 md:mt-2">
                    {s.body}
                  </p>

                  <div className="mt-3.5 md:mt-4">
                    <span className="inline-flex items-center text-xs font-medium text-primary-dark bg-secondary-surface border border-primary-brand/35 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg shadow-2xs">
                      {s.chip}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
