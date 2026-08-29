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
      className="relative pt-10 pb-0 sm:pt-14 lg:pt-16 overflow-hidden bg-[#fffee9]"
    >
      <div className="relative mx-auto max-w-container px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
        {/* ── LEFT COLUMN: value proposition ── */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 z-10 pb-12 lg:pb-16 pt-2">
          <span className="inline-flex items-center gap-2 rounded-pill bg-green px-3.5 py-1.5 text-xs font-bold text-ink">
            Hecho para taxistas colombianos
          </span>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-navy leading-[1.1]"
          >
            Plata pa&apos;l día a día,{' '}
            <span className="bg-green text-ink box-decoration-clone px-2 rounded-md">
              aprobada en minutos
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal">
            No necesitas contrato ni nómina. Simula tu cuota, solicita desde el celular
            y recibe la plata sin salir del carro.
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

        {/* ── RIGHT COLUMN: foto con recorte escalón Plataxi ── */}
        <div className="lg:col-span-6 flex items-center justify-end -mr-6 lg:-mr-8">
          <Image
            src="/taxi-hero-cut.png"
            alt="Taxista colombiano con Plataxi — VAL 245 Valledupar"
            width={1816}
            height={1636}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
