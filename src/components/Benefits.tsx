'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Benefit {
  id: string;
  icon: string;          // emoji / unicode char as accent
  title: string;
  body: string;
}

const BENEFITS: Benefit[] = [
  {
    id: 'express',
    icon: '⚡',
    title: 'Crédito exprés',
    body: 'Respuesta en minutos. Sin esperas ni filas. Aprobamos más rápido que el banco.',
  },
  {
    id: 'no-cosigner',
    icon: '🤝',
    title: 'Sin codeudor',
    body: 'Solo necesitas tu cédula y un soporte de ingresos. Nada más, nada menos.',
  },
  {
    id: 'flexible',
    icon: '📅',
    title: 'Pagos flexibles',
    body: 'Escoge pagar mensual o quincenal según tu flujo. Tú decides el plazo.',
  },
];

export function Benefits() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          },
        },
      );
    }

    const cards = containerRef.current?.querySelectorAll('[data-benefit="card"]');
    if (cards?.length) {
      gsap.fromTo(
        cards,
        { y: 36, scale: 0.96, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          stagger: 0.12,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="beneficios"
      aria-labelledby="benefits-heading"
      className="py-16 sm:py-20 lg:py-24 bg-[#fffee9]"
    >
      <div className="mx-auto max-w-container px-6">
        <div ref={headerRef} className="max-w-xl mx-auto text-center mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-2">
            Beneficios
          </p>
          <h2
            id="benefits-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-navy leading-[1.1]"
          >
            Tu crédito, a tu manera
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Diseñado para conductores y trabajadores independientes.
          </p>
        </div>

        {/* inDrive-style 3-up cards: white card, yellow accent mark + icon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {BENEFITS.map((b) => (
            <div
              key={b.id}
              data-benefit="card"
              className="group flex flex-col gap-4 bg-white border border-border rounded-3xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Yellow mark with icon */}
              <span
                aria-hidden="true"
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green text-2xl"
              >
                {b.icon}
              </span>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-navy">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
