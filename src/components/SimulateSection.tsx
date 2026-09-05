import { WhatsAppLink } from './WhatsAppLink';
import { SimulateAnim } from './SimulateAnim';

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <SimulateAnim>
      <div className="mx-auto max-w-container px-6">
        <div data-sim="header" className="mb-8 lg:mb-10 text-center space-y-2">
          <h2 id="simula-heading" className="text-[clamp(2.25rem,6.5vw,4rem)] font-display font-bold text-navy leading-[1.2] tracking-[-0.02em]">
            Calcula cuánto pagas y a qué plazo
          </h2>
        </div>
        <div data-sim="card" className="mx-auto max-w-3xl flex flex-col gap-4">
          {children}
          <WhatsAppLink
            ctx="simula"
            className="flex items-center justify-center gap-2.5 text-sm font-semibold text-green-ink hover:text-green-ink/80 transition-colors py-3"
          >
            <span className="wa-ico" aria-hidden="true" />
            ¿Dudas con la cuota? Escríbenos al WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </SimulateAnim>
  );
}
