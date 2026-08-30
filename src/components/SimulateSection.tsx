'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { WhatsAppLink } from './WhatsAppLink';

export function SimulateSection({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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
            start: 'top 80%',
          },
        },
      );
    }

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 32, scale: 0.98, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
          },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="simula"
      tabIndex={-1}
      aria-labelledby="simula-heading"
      className="py-14 sm:py-16 lg:py-20 bg-white"
    >
      <div className="mx-auto max-w-container px-6">
        <div ref={headerRef} className="mb-8 lg:mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-1.5">Cotizador digital</p>
          <h2 id="simula-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-tight text-navy">
            Simula tu crédito
          </h2>
        </div>
        <div ref={cardRef} className="mx-auto max-w-3xl flex flex-col gap-4">
          {children}
          <WhatsAppLink
            ctx="hero"
            className="flex items-center justify-center gap-2.5 text-sm font-semibold text-green-ink hover:text-green-ink/80 transition-colors py-3"
          >
            <span className="wa-ico" aria-hidden="true" />
            Hablar por WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
