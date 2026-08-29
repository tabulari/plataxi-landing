import Image from 'next/image';
import { WhatsAppLink } from './WhatsAppLink';

// Corte opuesto al hero: escalón sup-der e inf-izq
const CLIP = 'polygon(0% 0%, 80% 0%, 80% 20%, 100% 20%, 100% 100%, 20% 100%, 20% 80%, 0% 80%)';

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

        {/* Layout: simulador + imagen en desktop */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Simulador */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {children}
            <WhatsAppLink
              ctx="hero"
              className="flex items-center justify-center gap-2.5 text-sm font-semibold text-green-ink hover:text-green-ink/80 transition-colors py-3"
            >
              <span className="wa-ico" aria-hidden="true" />
              Hablar por WhatsApp
            </WhatsAppLink>
          </div>

          {/* Imagen — solo desktop */}
          <div className="hidden lg:block lg:w-[380px] xl:w-[440px] shrink-0 self-stretch relative min-h-[480px]">
            <div
              className="absolute inset-0"
              style={{ clipPath: CLIP }}
            >
              <Image
                src="/mobile-boy.jpeg"
                alt="Taxista revisando su crédito Plataxi desde el celular"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
