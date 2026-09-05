'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionEyebrow } from './SectionEyebrow';

interface Testimonial {
  id: string;
  initials: string;
  name: string;
  job: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    initials: 'CM',
    name: 'Carlos M.',
    job: 'Conductor independiente, Bogotá',
    quote: 'La plata me cayó en menos de una hora. No tuve que salir ni imprimir nada.',
  },
  {
    id: 't2',
    initials: 'LR',
    name: 'Liliana R.',
    job: 'Taxista, Medellín',
    quote: 'La cuota quincenal me cuadra perfecto con lo que me hago en el taxi.',
  },
  {
    id: 't3',
    initials: 'JP',
    name: 'Jhon P.',
    job: 'Taxista, Cali',
    quote: 'Sin fiador ni ir al banco. Pedí entre carreras y el dinero me llegó a Nequi.',
  },
];

export function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = containerRef.current?.querySelectorAll<HTMLElement>('[data-testimonial="card"]');
        if (!cards?.length) return;
        const tween = gsap.fromTo(
          cards,
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.06,
            duration: 0.35,
            ease: 'power2.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%', once: true },
          },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="testimonios"
      aria-labelledby="testimonials-heading"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-container px-6">
        <div className="max-w-xl mx-auto text-center mb-12 space-y-2">
          <SectionEyebrow>Casos reales</SectionEyebrow>
          <h2
            id="testimonials-heading"
            className="text-section font-display font-bold text-navy"
          >
            Conductores que ya ruedan con Plataxi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              data-testimonial="card"
              className="flex flex-col justify-between gap-5 bg-surface-card rounded-xl p-6 sm:p-7"
            >
              <blockquote className="text-base text-navy/90 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <footer className="flex items-center gap-3 pt-2">
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-brand text-primary-dark font-bold text-sm shrink-0"
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-navy">{t.name}</p>
                  <p className="text-xs text-muted-2">{t.job}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
