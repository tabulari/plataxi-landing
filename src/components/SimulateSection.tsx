import Image from 'next/image';
import { WhatsAppLink } from './WhatsAppLink';

// Escalones en la arista derecha de la imagen (que colinda con el simulador)
const CLIP_IMG = 'polygon(0% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 0% 100%)';

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="simula" tabIndex={-1} aria-labelledby="simula-heading" className="py-14 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-8 lg:mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-1.5">Cotizador digital</p>
          <h2 id="simula-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-tight text-navy">
            Simula tu crédito
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-14">

          {/* ── Imagen — solo desktop, izquierda ── */}
          <div className="hidden lg:block lg:w-[340px] xl:w-[400px] shrink-0 relative min-h-[520px]">
            <div
              className="absolute inset-0 bg-white overflow-hidden"
              style={{ clipPath: CLIP_IMG }}
            >
              <Image
                src="/mobile-boy.jpeg"
                alt="Taxista revisando su crédito Plataxi desde el celular"
                fill
                className="object-contain object-center"
                sizes="(min-width: 1280px) 400px, 340px"
              />
            </div>
          </div>

          {/* ── Simulador ── */}
          <div className="w-full lg:flex-1 flex flex-col gap-4 justify-center">
            {children}
            <WhatsAppLink
              ctx="hero"
              className="flex items-center justify-center gap-2.5 text-sm font-semibold text-green-ink hover:text-green-ink/80 transition-colors py-3"
            >
              <span className="wa-ico" aria-hidden="true" />
              Hablar por WhatsApp
            </WhatsAppLink>
          </div>

        </div>
      </div>
    </section>
  );
}
