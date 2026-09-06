'use client';

import { useEffect, useRef } from 'react';
import { fmtCOP, type Frequency } from '@/lib/credit';

interface SimData {
  payment: number;
  amount: number;
  term: number;
  periodRate: number;
  ea: number;
  totalCost: number;
  unit: string;
  adminFeePerPeriod: number;
  guaranteeFeeTotal: number;
}

export function SimulationResults({ sim }: { sim: SimData; frequency: Frequency }) {
  const paymentRef = useRef<HTMLDivElement>(null);
  const prevPayment = useRef(sim.payment);

  useEffect(() => {
    const changed = sim.payment !== prevPayment.current;
    prevPayment.current = sim.payment;
    if (!changed) return;
    const el = paymentRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.hidden) return;
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    const t = setTimeout(() => el.classList.remove('flash'), 280);
    return () => clearTimeout(t);
  }, [sim.payment]);

  return (
    <div className="mt-6 pt-6 border-t border-border/80 space-y-3">
      {/* Result Box — corto plazo 1-6 meses, abono diario/semanal/quincenal/mensual, cuota de administración + fianza (no interés) */}
      <div className="rounded-xl bg-gradient-to-br from-green-tint/70 to-secondary-surface/40 border border-green/30 p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col items-center text-center gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-green-ink block">Tu cuota estimada</span>
          <div
            ref={paymentRef}
            className="font-extrabold text-navy leading-none tabular-nums text-3xl sm:text-4xl lg:text-[42px] tracking-tight"
          >
            <span>${fmtCOP(sim.payment)}</span>{' '}
            <span className="text-sm sm:text-base font-semibold text-muted-2">{sim.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md pt-1.5">
            Cuota final fija con todo incluido. Cero cobros por adelantado ni sorpresas.{" "}
            <a
              href="#preguntas"
              className="font-semibold text-navy underline underline-offset-2 hover:text-green-ink inline-flex items-center min-h-[44px] py-1"
            >
              Ver detalle en preguntas frecuentes
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
