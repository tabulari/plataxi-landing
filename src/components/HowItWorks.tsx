'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { CheckCircleIcon, SparklesIcon, BoltIcon } from './icons';

interface Step {
  n: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: '01',
    Icon: CheckCircleIcon,
    title: 'Pide desde tu celular en 3 minutos',
    body: 'Ingresa tus datos y cédula en el formulario seguro. Todo 100% digital y sin filas.',
  },
  {
    n: '02',
    Icon: BoltIcon,
    title: 'Conoce tu cuota fija',
    body: 'Sin letra chica ni sorpresas: ves el valor exacto que pagarás en la fecha y plazo que elijas.',
  },
  {
    n: '03',
    Icon: SparklesIcon,
    title: 'Recibe tu dinero hoy',
    body: 'Aceptas en línea y te transferimos directo a Nequi, DaviPlata o tu cuenta bancaria.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const header = containerRef.current?.querySelectorAll<HTMLElement>('[data-hiw="header"] > *');
      const cards = containerRef.current?.querySelectorAll<HTMLElement>('[data-hiw="step"]');
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play reverse play reverse',
        },
      });
      if (header?.length) tl.fromTo(header, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 0);
      if (cards?.length) tl.fromTo(cards, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 }, 0.15);
      return () => tl.kill();
    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="como-funciona"
      aria-labelledby="hiw-heading"
      className="mt-16 md:mt-32"
    >
      <div className="mx-auto max-w-container px-6">
        <div data-hiw="header" className="mb-10 lg:mb-12 text-center max-w-2xl mx-auto space-y-2">
          <h2 id="hiw-heading" className="text-section font-display font-bold text-navy">
            Tu crédito en 3 pasos
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed">
            Un proceso transparente, 100% en línea y sin intermediarios.
          </p>
        </div>

        <ol className="grid grid-cols-1 timeline:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-hiw="step"
              className="rounded-lg bg-surface-card p-8 flex flex-col h-full"
            >
              <div className="flex items-center justify-between w-full mb-6">
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-brand text-primary-dark font-bold text-sm shrink-0 tabular-nums shadow-xs">
                  <span className="sr-only">Paso </span>
                  {s.n}
                </span>
                <s.Icon size={22} className="text-primary-dark/60 shrink-0" aria-hidden="true" />
              </div>

              <div className="space-y-2.5 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">{s.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
