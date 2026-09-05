/**
 * TEMPORARY comparison page — delete once the icon direction is decided.
 * Route: /logo-preview
 */
import { PlataxiLogo, PlataxiWordmark } from '@/components/icons';

const SIZES = [128, 64, 48, 32, 16];

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="text-lg font-bold text-navy mb-1">{title}</h2>
      {note && <p className="text-sm text-muted-foreground mb-5 max-w-2xl">{note}</p>}
      {children}
    </section>
  );
}

export default function LogoPreview() {
  return (
    <main className="mx-auto max-w-container px-6 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-2 mb-2">Vista temporal</p>
      <h1 className="text-3xl font-display font-bold text-navy mb-12">Icono: actual vs squircle</h1>

      <Panel
        title="1 · Lado a lado (256px)"
        note="Izquierda: el actual, rect con rx=128. Derecha: el nuevo, superelipse. La diferencia está en las esquinas — el rect cambia de curvatura de golpe, la superelipse es continua."
      >
        <div className="flex flex-wrap gap-10 items-end">
          <figure className="text-center">
            <PlataxiLogo size={256} />
            <figcaption className="mt-3 text-sm font-semibold text-navy">Actual · rect rx</figcaption>
          </figure>
          <figure className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plataxi-icon.svg" alt="Icono squircle" width={256} height={256} />
            <figcaption className="mt-3 text-sm font-semibold text-navy">Nuevo · squircle</figcaption>
          </figure>
        </div>
      </Panel>

      <Panel title="2 · Escala real" note="Tamaños de uso: 128 / 64 / 48 / 32 / 16 px.">
        <div className="space-y-6">
          <div className="flex items-end gap-6">
            <span className="w-20 text-xs font-semibold text-muted-2">Actual</span>
            {SIZES.map((s) => <PlataxiLogo key={s} size={s} />)}
          </div>
          <div className="flex items-end gap-6">
            <span className="w-20 text-xs font-semibold text-muted-2">Squircle</span>
            {SIZES.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s} src="/plataxi-icon.svg" alt="" width={s} height={s} />
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="3 · En contexto" note="Barra clara y pie oscuro, como en el sitio.">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-5 h-[68px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plataxi-icon.svg" alt="" width={32} height={32} />
            <PlataxiWordmark height={24} variant="dark" />
          </div>
          <div className="flex items-center gap-3 bg-primary-dark rounded-lg px-5 h-[68px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plataxi-icon.svg" alt="" width={32} height={32} />
            <PlataxiWordmark height={24} variant="white" />
          </div>
        </div>
      </Panel>

      <Panel title="4 · Sobre fondos" note="El badge amarillo sobre blanco, crema y oscuro.">
        <div className="flex flex-wrap gap-4">
          {[
            { bg: '#ffffff', label: 'blanco' },
            { bg: '#fffbe0', label: 'crema (tarjetas)' },
            { bg: '#111110', label: 'oscuro' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border p-8 flex flex-col items-center gap-3" style={{ background: s.bg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/plataxi-icon.svg" alt="" width={72} height={72} />
              <span className="text-xs font-semibold" style={{ color: s.bg === '#111110' ? '#fff' : '#111110' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="5 · Lockup completo" note="public/plataxi-logo.svg — isotipo + wordmark contorneado, sin tagline.">
        <div className="space-y-4">
          <div className="rounded-lg bg-surface-card p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plataxi-logo.svg" alt="Plataxi" width={420} height={68} />
          </div>
          <div className="rounded-lg bg-primary-dark p-8 text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/plataxi-logo.svg" alt="Plataxi" width={420} height={68} style={{ filter: 'invert(1)' }} />
          </div>
        </div>
      </Panel>

      <Panel title="6 · Favicons regenerados" note="favicon.svg (squircle) · apple-touch-icon.png (cuadrado a sangre — iOS aplica su propia máscara) · favicon-32.png">
        <div className="flex flex-wrap gap-8 items-end">
          {[
            { src: '/favicon.svg', label: 'favicon.svg', size: 96 },
            { src: '/apple-touch-icon.png', label: 'apple-touch-icon', size: 96 },
            { src: '/favicon-32.png', label: 'favicon-32 (a 32px)', size: 32 },
          ].map((a) => (
            <figure key={a.label} className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt="" width={a.size} height={a.size} />
              <figcaption className="mt-2 text-xs font-semibold text-muted-2">{a.label}</figcaption>
            </figure>
          ))}
        </div>
      </Panel>
    </main>
  );
}
