'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollButton } from './ScrollButton';
import { ApplyButton } from './ApplyButton';
import { ShieldCheckIcon, LockIcon } from './icons';

const STATS: { value: string; label: string }[] = [
  { value: '$1.000.000', label: 'Cupo máximo' },
  { value: 'Minutos', label: 'Respuesta' },
  { value: '100%', label: 'En línea' },
];

// Clip-path inDrive: escalón sup-izq e inf-der estilizado y compacto (10%) para acercar la imagen al texto.
const CLIP = 'polygon(10% 0%, 100% 0%, 100% 90%, 90% 90%, 90% 100%, 0% 100%, 0% 10%, 10% 10%)';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const textItems = textColRef.current?.querySelectorAll('[data-hero-anim]');
    const imageContainer = imageColRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse',
      },
    });

    if (textItems && textItems.length > 0) {
      tl.fromTo(
        textItems,
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.09 },
        0.1,
      );
    }

    if (imageContainer) {
      tl.fromTo(
        imageContainer,
        { x: 35, scale: 0.96, autoAlpha: 0 },
        { x: 0, scale: 1, autoAlpha: 1, duration: 0.85, ease: 'power3.out' },
        0.2,
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white"
      style={{ minHeight: '70vh' }}
    >
      {/* Grid centrado en max-w-container estilo Credalia */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mx-auto max-w-container px-6 py-12 lg:py-16"
        style={{ minHeight: 'inherit' }}
      >
        {/* ── LEFT COLUMN ── */}
        <div ref={textColRef} className="flex flex-col justify-center space-y-6 z-10 max-w-lg">
          <div data-hero-anim>
            <span className="inline-flex items-center gap-2 rounded-pill bg-secondary-surface border-2 border-primary-brand px-3.5 py-1.5 text-xs font-bold text-primary-dark w-fit shadow-xs">
              Hecho para taxistas colombianos
            </span>
          </div>

          <h1
            id="hero-heading"
            data-hero-anim
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-display font-black tracking-tight text-navy leading-[1.18]"
          >
            Plata pa&apos;l día a día,<br />
            <span className="inline-block bg-secondary-surface text-primary-dark border-2 border-primary-brand px-3.5 py-1 rounded-xl mt-1.5 shadow-sm">
              aprobada en minutos
            </span>
          </h1>

          <p data-hero-anim className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
            Sin nómina ni codeudor. Solicita desde el celular y recibe la plata el mismo día.
          </p>

          <div data-hero-anim className="flex flex-wrap items-center gap-3.5 pt-1">
            <ScrollButton
              variant="default"
              size="lg"
              target="#simula"
              className="w-full sm:w-auto min-h-[52px] px-8 rounded-xl font-bold bg-green text-ink hover:bg-green-bright shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Simular mi crédito
            </ScrollButton>

            <ApplyButton
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-h-[52px] px-7 rounded-xl font-bold border-2 border-navy text-navy hover:bg-navy hover:text-white transition-all active:scale-[0.98]"
            >
              Solicitar crédito
            </ApplyButton>
          </div>

          {/* Stats row */}
          <dl data-hero-anim className="flex flex-wrap gap-x-8 gap-y-4 pt-2">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl sm:text-3xl font-display font-black text-navy leading-none">
                  {s.value}
                </dd>
                <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-2">
                  {s.label}
                </span>
              </div>
            ))}
          </dl>

          {/* Trust badges */}
          <div data-hero-anim className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-2">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheckIcon size={16} className="text-ink shrink-0" />
              Estudio 100% digital y gratuito
            </span>
            <span className="hidden sm:inline text-border" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <LockIcon size={16} className="text-ink shrink-0" />
              Datos cifrados y protegidos
            </span>
          </div>
        </div>

        {/* ── RIGHT COLUMN: imagen centrada e integrada ── */}
        <div ref={imageColRef} className="relative hidden lg:block h-[460px] xl:h-[500px] w-full">
          <div
            className="absolute inset-0 shadow-2xl rounded-3xl overflow-hidden"
            style={{ clipPath: CLIP }}
          >
            <Image
              src="/taxista.jpeg"
              alt="Taxista colombiano con Plataxi — VAL 245 Valledupar"
              fill
              className="object-cover"
              style={{ objectPosition: '70% center' }}
              priority
            />
          </div>
        </div>

        {/* ── MOBILE: imagen debajo del texto ── */}
        <div className="relative lg:hidden h-[280px] sm:h-[360px] overflow-hidden mt-2">
          <div
            className="absolute inset-0"
            style={{ clipPath: 'polygon(0% 0%, 88% 0%, 88% 12%, 100% 12%, 100% 100%, 0% 100%)' }}
          >
            <Image
              src="/taxista.jpeg"
              alt="Taxista colombiano con Plataxi"
              fill
              className="object-cover"
              style={{ objectPosition: '62% 40%' }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
