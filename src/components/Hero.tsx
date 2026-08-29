'use client';

import Image from 'next/image';
import { ScrollButton } from './ScrollButton';
import { ApplyButton } from './ApplyButton';
import { ShieldCheckIcon, LockIcon } from './icons';

const STATS: { value: string; label: string }[] = [
  { value: '$1.000.000', label: 'Cupo máximo' },
  { value: 'Minutos', label: 'Respuesta' },
  { value: '100%', label: 'En línea' },
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 overflow-hidden bg-white"
    >
      {/* Yellow accent shapes behind the hero (inDrive-style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-green/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-10 h-40 w-40 rounded-[36px] rotate-12 bg-green/40 hidden lg:block"
      />

      <div className="relative mx-auto max-w-container px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* ── LEFT COLUMN: value proposition ── */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 z-10">
          <span className="inline-flex items-center gap-2 rounded-pill bg-green px-3.5 py-1.5 text-xs font-bold text-ink">
            Crédito digital en Colombia
          </span>

          {/* Display H1 — key phrase gets a yellow marker highlight (dark text stays legible) */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-navy leading-[1.1]"
          >
            Tu crédito,{' '}
            <span className="bg-green text-ink box-decoration-clone px-2 rounded-md">
              aprobado en minutos
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal">
            Simula tu cuota, solicita 100% en línea y recibe respuesta al instante.
            Tasa clara y sin papeles.
          </p>

          {/* CTAs — primary is yellow with black text (signature look) */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto pt-1">
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

          {/* Stats row (inDrive-style) */}
          <dl className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
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

          {/* Trust badges — dark icons for contrast on white */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-muted-2">
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

        {/* ── RIGHT COLUMN: taxista con estilo de recortes superpuestos ── */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="relative w-full max-w-[460px]">
            {/* Bloque de color amarillo — detrás, desplazado abajo-derecha */}
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -right-5 left-8 top-8 bg-green rounded-2xl"
            />
            {/* Foto taxista — recortada a proporción retrato, foco en conductor */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/5]">
              <Image
                src="/taxista.jpeg"
                alt="Taxista colombiano con Plataxi"
                fill
                className="object-cover"
                style={{ objectPosition: '72% center' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
