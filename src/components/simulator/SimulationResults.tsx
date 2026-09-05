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
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-green/20 text-navy font-semibold">
              Administración: ${fmtCOP(sim.adminFeePerPeriod)} {sim.unit}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-green/20 text-navy font-semibold">
              Fianza: ${fmtCOP(sim.guaranteeFeeTotal)} total
            </span>
          </div>
          <p className="text-[11px] text-muted-2 leading-relaxed pt-1">
            Sin interés oculto — cuota fija incluye administración y fianza.{" "}
            <a href="#preguntas" className="font-semibold text-navy underline underline-offset-2 hover:text-green-ink">
              Ver detalle en preguntas frecuentes
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
