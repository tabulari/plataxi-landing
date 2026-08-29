'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PersonIcon, IdCardIcon, CreditCardIcon, DocumentIcon } from './icons';

interface RequirementItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
}

const REQUIREMENTS_DATA: RequirementItem[] = [
  {
    id: 'age',
    icon: <PersonIcon size={22} className="text-ink" />,
    title: 'Tener más de 18 años',
    detail: 'Vivir en Colombia.',
  },
  {
    id: 'id',
    icon: <IdCardIcon size={22} className="text-ink" />,
    title: 'Cédula de ciudadanía',
    detail: 'Física o digital, que esté vigente.',
  },
  {
    id: 'bank',
    icon: <CreditCardIcon size={22} className="text-ink" />,
    title: 'Tu cuenta o Nequi',
    detail: 'A tu nombre, para enviarte el dinero.',
  },
  {
    id: 'income',
    icon: <DocumentIcon size={22} className="text-ink" />,
    title: 'Soporte de ingresos',
    detail: 'Un extracto o colilla reciente.',
  },
];

export function Requirements() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const heading = containerRef.current?.querySelector('[data-req="heading"]');
    const cards = containerRef.current?.querySelectorAll('[data-req="card"]');

    if (heading) {
      gsap.fromTo(
        heading,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 85%' },
        },
      );
    }

    if (cards && cards.length) {
      gsap.fromTo(
        cards,
        { y: 24, autoAlpha: 0, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="requisitos-band"
      aria-labelledby="req-heading"
      className="py-12 sm:py-14 lg:py-16 bg-white relative overflow-hidden"
    >
      <div className="mx-auto max-w-container px-6">
        {/* Header Block */}
        <div data-req="heading" className="max-w-2xl mx-auto text-center mb-8 lg:mb-10 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-1">Requisitos</p>
          <h2
            id="req-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight text-navy leading-[1.12]"
          >
            Solo necesitas <span className="bg-green text-ink box-decoration-clone px-2 rounded-md">4 cosas</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-lg mx-auto">
            Sin fiador ni papeleos. Puedes pedirlo desde tu celular en 5 minutos.
          </p>
        </div>

        {/* 2x2 Clean Human Requirements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {REQUIREMENTS_DATA.map((item) => (
            <div
              key={item.id}
              data-req="card"
              className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:shadow-md hover:border-green/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-green border border-green/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-200">
                {item.icon}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-navy mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
