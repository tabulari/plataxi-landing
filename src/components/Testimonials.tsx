'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface Testimonial {
  id: string;
  initials: string;
  name: string;
  job: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    initials: 'CM',
    name: 'Carlos M.',
    job: 'Conductor independiente, Bogotá',
    quote: 'Me llegó el dinero en menos de una hora. No tuve que salir ni imprimir nada. Definitivamente vuelvo.',
    rating: 5,
  },
  {
    id: 't2',
    initials: 'LR',
    name: 'Liliana R.',
    job: 'Taxista, Medellín',
    quote: 'La cuota quincenal me encaja perfecto con mis ingresos. El simulador me ayudó a elegir el plazo ideal.',
    rating: 5,
  },
  {
    id: 't3',
    initials: 'JP',
    name: 'Jhon P.',
    job: 'Mensajero en moto, Cali',
    quote: 'Sin fiador, sin ir al banco. Solo con mi cédula y el extracto de Nequi. No lo podía creer.',
    rating: 5,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < n ? '#f5e15b' : 'none'}
          stroke={i < n ? '#f5e15b' : '#d1d5db'}
          strokeWidth="1.8"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const cards = containerRef.current?.querySelectorAll('[data-testimonial="card"]');
    if (cards?.length) {
      gsap.fromTo(
        cards,
        { y: 24, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="testimonios"
      aria-labelledby="testimonials-heading"
      className="py-16 sm:py-20 lg:py-24 bg-white"
    >
      <div className="mx-auto max-w-container px-6">
        <div className="max-w-xl mx-auto text-center mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-2">
            Impacto real
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-navy leading-[1.18]"
          >
            Lo que dicen nuestros <span className="inline-block bg-secondary-surface text-primary-dark border-2 border-primary-brand px-2.5 py-0.5 rounded-lg align-baseline shadow-xs">conductores</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              data-testimonial="card"
              className="flex flex-col gap-4 bg-white rounded-3xl border border-border p-6 hover:shadow-md transition-shadow duration-200"
            >
              <Stars n={t.rating} />

              <blockquote className="text-sm text-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author row — avatar initials on yellow */}
              <footer className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green text-ink font-bold text-sm shrink-0"
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
