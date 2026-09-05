'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
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
    body: 'Pide desde $100.000 y aumenta tu cupo a medida que ruedas con nosotros.',
  },
  {
    id: 'digital',
    Icon: LightningIcon,
    title: '100% digital',
    body: 'Solicitas desde tu celular en 3 minutos. Sin filas, papeleos ni ir a oficinas.',
  },
  {
    id: 'no-fees',
    Icon: ShieldCheckIcon,
    title: 'Cero cobros previos',
    body: 'No pagas pólizas, seguros ocultos ni adelantos. Cero trampas.',
  },
  {
    id: 'flexible',
    Icon: CalendarIcon,
    title: 'Pagos a tu medida',
    body: 'Eliges abono diario, semanal, quincenal o mensual según tu producido.',
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
        { y: 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.35,
          ease: 'power2.out',
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
        { y: 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.05,
          duration: 0.35,
          ease: 'power2.out',
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
      className="mt-16 md:mt-32"
    >
      <div className="mx-auto max-w-container px-6">
        <div ref={headerRef} className="max-w-3xl lg:max-w-4xl mx-auto text-center mb-10 lg:mb-12 space-y-2">
          <h2
            id="benefits-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] font-display font-bold text-navy tracking-tight"
          >
            Tu crédito,{' '}
            <mark className="inline-block bg-primary-brand text-primary-dark px-3 py-0.5 rounded-lg align-baseline">
              a tu propio ritmo
            </mark>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Para el producido del turno, el mantenimiento del taxi o cualquier imprevisto del día.
          </p>
        </div>

        {/* Section panoramic image preserved — inDrive 2:1 aspect ratio with rounded-3xl */}
        <div className="relative w-full aspect-[3/2] sm:aspect-[2/1] rounded-3xl overflow-hidden mb-8 lg:mb-10 shadow-xs border border-border/40">
          <Image
            src="/hero-conductor.webp"
            alt="Conductor de taxi colombiano consultando su celular junto a su vehículo"
            fill
            sizes="(min-width: 1120px) 1072px, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* 2 white / 2 cream for Bento diversity (was 4 cream on white) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 stack:grid-cols-4 gap-5 lg:gap-6">
          {BENEFITS.map((b, i) => (
            <div
              key={b.id}
              data-benefit="card"
              className={`flex flex-col gap-4 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-shadow duration-200 ${
                i % 2 === 0 ? 'bg-white border border-border/40' : 'bg-surface-card'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-brand/20 text-primary-dark flex items-center justify-center shrink-0">
                <b.Icon size={24} className="text-primary-dark stroke-[2.2]" aria-hidden="true" />
              </div>

              <div className="space-y-1.5 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-navy tracking-tight">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
