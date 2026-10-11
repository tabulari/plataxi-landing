import { SimulateAnim } from './SimulateAnim';

export function SimulateSection({ children }: { children: React.ReactNode }) {
  return (
    <SimulateAnim>
      <div className="mx-auto max-w-container px-6">
        <div data-sim="header" className="mb-8 lg:mb-10 text-center space-y-2">
          <h2 id="simula-heading" className="text-section font-display font-bold text-navy">
            Calcula cuánto pagas y a qué plazo
          </h2>
        </div>
        <div data-sim="card" className="mx-auto max-w-xl flex flex-col gap-4">
          {children}
        </div>
      </div>
    </SimulateAnim>
  );
}
