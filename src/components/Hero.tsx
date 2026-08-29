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

// Clip-path inDrive: escalón sup-izq e inf-der. Notch reducido a 20% para acercar la imagen al texto.
const CLIP = 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 80%, 80% 100%, 0% 100%, 0% 20%, 20% 20%)';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#fffee9]"
      style={{ minHeight: '70vh' }}
    >
      {/* Grid con padding lateral para dar aire a ambos lados */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 px-4 sm:px-6 lg:px-8 xl:px-10 gap-x-0"
        style={{ minHeight: 'inherit' }}
      >
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col justify-center pl-6 sm:pl-8 lg:pl-[13rem] pr-8 lg:pr-14 xl:pr-20 py-14 lg:pt-[210px] lg:pb-20 space-y-6 z-10">
          <span className="inline-flex items-center gap-2 rounded-pill bg-green px-3.5 py-1.5 text-xs font-bold text-ink w-fit">
            Hecho para taxistas colombianos
          </span>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-display font-black tracking-tight text-navy leading-[1.15]"
          >
            Plata pa&apos;l día a día,<br />
            <span className="bg-green text-ink box-decoration-clone px-2 rounded-md">
              aprobada en minutos
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md font-normal">
            Sin nómina ni codeudor. Solicita desde el celular y recibe la plata el mismo día.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1">
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
          <dl className="flex flex-wrap gap-x-8 gap-y-4 pt-2">
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
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-2">
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

        {/* ── RIGHT COLUMN: imagen llena la mitad derecha con clip-path ── */}
        <div className="relative hidden lg:block">
          <div
            className="absolute top-8 xl:top-12 bottom-0 left-0 right-6 lg:right-10 xl:right-14"
            style={{ clipPath: CLIP }}
          >
            <Image
              src="/taxista.jpeg"
              alt="Taxista colombiano con Plataxi — VAL 245 Valledupar"
              fill
              className="object-cover"
              style={{ objectPosition: '75% center' }}
              priority
            />
          </div>
        </div>

        {/* ── MOBILE: imagen debajo del texto ── */}
        <div className="relative lg:hidden h-[280px] sm:h-[360px] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ clipPath: 'polygon(0% 0%, 82% 0%, 82% 18%, 100% 18%, 100% 100%, 0% 100%)' }}
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
