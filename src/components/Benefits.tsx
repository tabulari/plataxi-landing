'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionEyebrow } from './SectionEyebrow';
import { LightningIcon, ShieldCheckIcon, CalendarIcon, CreditCardIcon } from './icons';
import { config } from '@/lib/config';
import { fmtCOP } from '@/lib/credit';

interface Benefit {
  id: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}

const MAX_AMOUNT = `$${fmtCOP(config.simulator.amountMax).replace(',00', '')}`;

const BENEFITS: Benefit[] = [
  {
    id: 'amount',
    Icon: CreditCardIcon,
    title: `Hasta ${MAX_AMOUNT}`,
    body: 'Tu cupo crece con tu historial. Empieza hoy y accede a montos mayores.',
  },
  {
    id: 'express',
    Icon: LightningIcon,
    title: 'Crédito exprés',
    body: 'Respuesta en minutos. Sin esperas ni filas. Aprobamos más rápido que el banco.',
  },
  {
    id: 'no-fees',
    Icon: ShieldCheckIcon,
    title: 'Cero cobros previos',
    body: 'No te pedimos plata por adelantado ni seguros sorpresa. Todo es claro y transparente.',
  },
  {
    id: 'flexible',
    Icon: CalendarIcon,
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
      className="mt-16 md:mt-32"
    >
      <div className="mx-auto max-w-container px-6">
        <div ref={headerRef} className="max-w-xl mx-auto text-center mb-12 space-y-2">
          <SectionEyebrow>Beneficios</SectionEyebrow>
          <h2
            id="benefits-heading"
            className="text-section font-display font-bold text-navy"
          >
            Tu crédito, a tu manera
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Diseñado para conductores y trabajadores independientes.
          </p>
        </div>

        {/* Section image above the cards, as in the reference. Source is 2:1;
            a taller ratio on small screens keeps the subject readable. Lazy —
            it is below the fold and must not compete with the hero for LCP. */}
        <div className="relative w-full aspect-[3/2] sm:aspect-[2/1] rounded-lg overflow-hidden mb-8 lg:mb-10">
          <Image
            src="/hero-conductor.webp"
            alt="Conductor de taxi colombiano consultando su celular junto a su vehículo"
            fill
            sizes="(min-width: 1120px) 1072px, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Flat cream 4-up cards on the white canvas — no border, no shadow. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 stack:grid-cols-4 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.id}
              data-benefit="card"
              className="flex flex-col gap-4 bg-surface-card rounded-lg p-8"
            >
              <b.Icon size={32} className="text-primary-dark shrink-0" aria-hidden="true" />

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
