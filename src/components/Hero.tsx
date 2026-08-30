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

// Clip-path inDrive: escalón sup-izq e inf-der estilizado y compacto (10%) para acercar la imagen al texto.
const CLIP = 'polygon(10% 0%, 100% 0%, 100% 90%, 90% 90%, 90% 100%, 0% 100%, 0% 10%, 10% 10%)';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#fffee9]"
      style={{ minHeight: '70vh' }}
    >
      {/* Grid con padding lateral sincronizado con el Navbar y distribución fluida 7/5 */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 px-4 sm:px-6 lg:px-10 xl:px-14 max-w-[1536px] mx-auto gap-8 lg:gap-8 items-center"
        style={{ minHeight: 'inherit' }}
      >
        {/* ── LEFT COLUMN: Texto amplio y contundente (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col justify-center py-12 lg:py-16 xl:py-20 space-y-6 z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-pill bg-green px-3.5 py-1.5 text-xs font-bold text-ink w-fit">
            Hecho para taxistas colombianos
          </span>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-display font-black tracking-tight text-navy leading-[1.12]"
          >
            Plata pa&apos;l día a día,<br />
            <span className="bg-green text-ink box-decoration-clone px-2 rounded-md">
              aprobada en minutos
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl font-normal">
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

        {/* ── RIGHT COLUMN: imagen integrada y conectada (5 cols) ── */}
        <div className="lg:col-span-5 relative hidden lg:block h-[460px] xl:h-[520px] w-full">
          <div
            className="absolute inset-0 shadow-2xl rounded-2xl overflow-hidden"
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
