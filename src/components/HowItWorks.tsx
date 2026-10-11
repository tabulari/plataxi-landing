'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckIcon } from './icons';
import { ScrollButton } from './ScrollButton';
import { config } from '@/lib/config';
import { fmtCOP } from '@/lib/credit';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MAX_AMOUNT = `$${fmtCOP(config.simulator.amountMax).replace(',00', '')}`;

const BENEFITS = [
  {
    title: 'Solo con tu cédula y tu celular',
    body: 'Elige el monto que necesitas hoy y págalo a tu ritmo con cuota fija diaria.',
  },
  {
    title: `Hasta ${MAX_AMOUNT}`,
    body: 'Pide desde $100.000 y aumenta tu cupo a medida que ruedas con nosotros.',
  },
  {
    title: '100% digital',
    body: 'Solicitas desde tu celular en 3 minutos. Sin filas, papeleos ni ir a oficinas.',
  },
  {
    title: 'Cero cobros previos',
    body: 'No pagas pólizas, seguros ocultos ni adelantos.',
  },
  {
    title: 'Pagos a tu medida',
    body: 'Eliges abono diario, semanal, quincenal o mensual según tu producido.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const root = containerRef.current;
        if (!root) return;
        gsap.set(
          root.querySelectorAll(
            '[data-hiw="header"] > *, [data-hiw="image"], [data-hiw="item"], [data-hiw="cta"]',
          ),
          {
            autoAlpha: 1,
            y: 0,
            clearProps: 'transform',
          },
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = containerRef.current;
        if (!root) return;
        const header = root.querySelectorAll<HTMLElement>('[data-hiw="header"] > *');
        const img = root.querySelector<HTMLElement>('[data-hiw="image"]');
        const items = root.querySelectorAll<HTMLElement>('[data-hiw="item"]');
        const cta = root.querySelector<HTMLElement>('[data-hiw="cta"]');

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            once: true,
          },
        });

        if (header.length) {
          tl.fromTo(header, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.05 }, 0);
        }
        if (img) {
          tl.fromTo(img, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.08);
        }
        if (items.length) {
          tl.fromTo(items, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06 }, 0.12);
        }
        if (cta) {
          tl.fromTo(cta, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3 }, 0.3);
        }

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="como-funciona"
      aria-labelledby="hiw-heading"
      className="mt-16 md:mt-28 mb-20 md:mb-28 relative"
    >
      <div className="mx-auto max-w-container px-6">
        <div data-hiw="header" className="mb-10 lg:mb-14 text-center max-w-2xl mx-auto">
          <h2 id="hiw-heading" className="text-section font-display font-bold text-navy">
            ¿Necesitas efectivo?{' '}
            <mark className="inline-block bg-primary-brand text-primary-dark px-2.5 py-0.5 rounded-none shadow-xs">
              Obtén tu crédito en minutos
            </mark>
          </h2>
        </div>

        {/* Card amplia que contiene la foto y los beneficios.
            En desktop (stack: >= 980px) la foto va a la izquierda y se apoya en el borde inferior (stack:pb-0 en la card),
            mientras que la columna de beneficios conserva su padding inferior (stack:pb-8).
            En móvil y tablet la foto es el último hijo y se apoya igualmente en el borde inferior. */}
        <div className="bg-white rounded-none shadow-sm border border-border/80 max-w-6xl mx-auto p-6 pb-0 sm:p-10 sm:pb-0 stack:px-10 stack:pt-8 stack:pb-0 overflow-hidden">
          <div className="grid grid-cols-1 gap-0 stack:grid-cols-[1.12fr_1fr] stack:gap-8 stack:items-stretch">
            {/* Beneficios + CTA — primero en el DOM para que en móvil/tablet queden sobre la foto. */}
            <div className="mb-2.5 stack:mb-0 stack:order-2 stack:pb-8 flex flex-col justify-between gap-5 sm:gap-6">
              <ul aria-label="Beneficios de tu crédito con Plataxi" className="space-y-4 sm:space-y-5">
                {BENEFITS.map((b) => (
                  <li
                    key={b.title}
                    data-hiw="item"
                    className="flex items-start gap-4 sm:gap-5 text-left"
                  >
                    {/* Chulos con fondo crema suave, borde amarillo (246 216 96) y check amarillo (246 216 96) */}
                    <div
                      aria-hidden="true"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-none bg-secondary-surface border border-primary-brand flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold"
                    >
                      <CheckIcon size={24} className="stroke-[3.5] text-primary-brand" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-navy tracking-tight leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-0.5">
                        {b.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* CTA Simular mi cuota scroll a #simula */}
              <div data-hiw="cta" className="pt-2 flex justify-start">
                <ScrollButton
                  variant="default"
                  size="lg"
                  target="#simula"
                  className="w-full sm:w-auto min-h-[50px] px-10 rounded-none font-bold text-base bg-primary-brand text-primary-dark hover:bg-primary-brand/90 transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  Simular mi cuota
                </ScrollButton>
              </div>
            </div>

            {/* Foto Conductor — a la izquierda en desktop (stack:order-1), debajo del texto en móvil.
                Comienza desde el final de la card (borde inferior) y se extiende hacia arriba sin cortar nada. */}
            <div data-hiw="image" className="stack:order-1 relative w-full flex items-end justify-center stack:justify-start">
              <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] stack:aspect-auto stack:h-full stack:min-h-[580px]">
                <Image
                  src="/driver-card.jpeg"
                  alt="Conductor de taxi con crédito aprobado en Plataxi"
                  fill
                  sizes="(min-width: 980px) 600px, 100vw"
                  className="object-contain object-bottom scale-105 stack:scale-[1.08] origin-bottom"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
