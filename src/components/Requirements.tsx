'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { CheckIcon } from './icons';

interface RequirementItem {
  id: string;
  title: string;
  detail: string;
}

const REQUIREMENTS_DATA: RequirementItem[] = [
  {
    id: 'age',
    title: 'Tener más de 18 años',
    detail: 'Vivir en Colombia.',
  },
  {
    id: 'id',
    title: 'Cédula de ciudadanía',
    detail: 'Física o digital, que esté vigente.',
  },
  {
    id: 'bank',
    title: 'Tu cuenta o Nequi',
    detail: 'A tu nombre, para enviarte el dinero.',
  },
  {
    id: 'income',
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
    const image = containerRef.current?.querySelector('[data-req="image"]');
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
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          },
        },
      );
    }

    if (image) {
      gsap.fromTo(
        image,
        { x: -24, autoAlpha: 0, scale: 0.96 },
        {
          x: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
            end: 'bottom 18%',
            toggleActions: 'play reverse play reverse',
          },
        },
      );
    }

    if (cards && cards.length) {
      gsap.fromTo(
        cards,
        { x: 24, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
            end: 'bottom 18%',
            toggleActions: 'play reverse play reverse',
          },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="requisitos-band"
      aria-labelledby="req-heading"
      className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden"
    >
      <div className="mx-auto max-w-container px-6">
        {/* Header Block */}
        <div data-req="heading" className="max-w-2xl mx-auto text-center mb-10 lg:mb-12 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Requisitos</p>
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

        {/* 2-Column Layout: Image + Stacked Requirement Cards */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Left: Mobile boy image */}
          <div
            data-req="image"
            className="w-full max-w-md lg:max-w-[420px] aspect-[4/3] sm:aspect-square relative rounded-3xl overflow-hidden shadow-sm border border-neutral-100 bg-neutral-100 flex-shrink-0"
          >
            <Image
              src="/mobile-boy.jpeg"
              alt="Persona solicitando su crédito desde el celular"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover object-center"
              priority={false}
            />
          </div>

          {/* Right: Vertical List of Requirements */}
          <div className="flex flex-col gap-3.5 sm:gap-4 w-full max-w-md lg:max-w-lg">
            {REQUIREMENTS_DATA.map((item) => (
              <div
                key={item.id}
                data-req="card"
                className="group flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-green/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary-surface border border-primary-brand/30 flex items-center justify-center flex-shrink-0 text-navy group-hover:bg-primary-brand transition-colors duration-200">
                  <CheckIcon size={20} className="text-navy stroke-[3]" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-navy leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
