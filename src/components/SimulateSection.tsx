import Image from 'next/image';
import { WhatsAppLink } from './WhatsAppLink';

// Escalón en arista derecha: sup-der e inf-der (imagen izquierda → simulador derecha)
const CLIP_IMG = 'polygon(0% 0%, 82% 0%, 82% 18%, 100% 18%, 100% 82%, 82% 82%, 82% 100%, 0% 100%)';

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="simula"
      tabIndex={-1}
      aria-labelledby="simula-heading"
      className="bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="mx-auto max-w-container px-6 pt-14 sm:pt-16 lg:pt-20 pb-8 lg:pb-10 text-center">
        <h2
          id="simula-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-tight text-navy"
        >
          Simula tu crédito
        </h2>
      </div>

      {/* Split layout: imagen izquierda + simulador derecha */}
      <div className="flex flex-col lg:flex-row lg:items-stretch">

        {/* ── Imagen — full-height en desktop ── */}
        <div className="hidden lg:block lg:w-[40%] xl:w-[42%] shrink-0 relative self-stretch min-h-[640px]">
          <div
            className="absolute top-8 xl:top-12 bottom-8 xl:bottom-12 left-6 lg:left-10 xl:left-14 right-0"
            style={{ clipPath: CLIP_IMG }}
          >
            <Image
              src="/mobile-boy.jpeg"
              alt="Taxista colombiano con Plataxi en Cartagena"
              fill
              className="object-cover"
              style={{ objectPosition: '55% 15%' }}
              sizes="(min-width: 1280px) 42vw, 40vw"
            />
          </div>
        </div>

        {/* ── Simulador ── */}
        <div className="flex-1 px-6 sm:px-8 lg:px-12 xl:px-16 pb-14 sm:pb-16 lg:pb-20 flex flex-col gap-4 justify-center">
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
    </section>
  );
}
