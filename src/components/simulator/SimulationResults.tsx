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
      {/* High-Clarity Result Box — A: Full hide (only TU CUOTA) — for validation, no Total/Interés/Tasa/TEA */}
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
          <p className="text-[11px] text-muted-2 leading-relaxed pt-1">
            Valor estimado con plazo y monto seleccionados.{" "}
            <a href="#preguntas" className="font-semibold text-navy underline underline-offset-2 hover:text-green-ink">
              Ver tasa y costo total en preguntas frecuentes
            </a>
            . Detalles y condiciones se confirman al validar tu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
