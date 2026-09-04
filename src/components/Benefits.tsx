'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { BoltIcon, ShieldCheckIcon, CalendarIcon } from './icons';
import { cn } from '@/lib/utils';

interface Benefit {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
  featured?: boolean;
}

const BENEFITS: Benefit[] = [
  {
    id: 'express',
    icon: BoltIcon,
    title: 'Crédito exprés',
    body: 'Respuesta en minutos. Sin esperas ni filas. Aprobamos más rápido que el banco.',
    featured: true,
  },
  {
    id: 'no-cosigner',
    icon: ShieldCheckIcon,
    title: 'Sin codeudor',
    body: 'Solo necesitas tu cédula y un soporte de ingresos. Nada más, nada menos.',
  },
  {
    id: 'flexible',
    icon: CalendarIcon,
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
            once: true,
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
            once: true,
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
      className="py-16 sm:py-20 lg:py-24 bg-white"
    >
      <div className="mx-auto max-w-container px-6">
        <div ref={headerRef} className="max-w-xl mx-auto text-center mb-12 space-y-2">
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

        {/* inDrive-style cards: elevated featured card + clean supporting cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                data-benefit="card"
                className={cn(
                  'group flex flex-col gap-4 rounded-3xl p-7 transition-all duration-200 hover:-translate-y-1',
                  b.featured
                    ? 'bg-secondary-surface border-2 border-primary-brand/80 shadow-md hover:shadow-xl'
                    : 'bg-white border border-secondary-border/50 hover:border-primary-brand hover:shadow-lg',
                )}
              >
                {/* Yellow mark with icon */}
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-surface border-2 border-primary-brand text-primary-dark shadow-xs"
                  >
                    <Icon size={24} className="text-primary-dark stroke-[2.2]" />
                  </span>
                  {b.featured && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary-dark bg-secondary-surface border border-primary-brand/50 px-2.5 py-1 rounded-pill">
                      Más elegido
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-navy">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
