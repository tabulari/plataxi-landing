'use client';

import { useEffect, useRef } from 'react';
import { fmtCOP, fmtPct, type Frequency } from '@/lib/credit';

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

  const interestCost = Math.max(0, sim.totalCost - sim.amount);

  return (
    <div className="mt-6 pt-6 border-t border-border/80 space-y-3">
      {/* High-Clarity Result Box (Fintech Standard) */}
      <div className="rounded-xl bg-gradient-to-br from-green-tint/70 to-emerald-50/40 border border-green/30 p-4 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          {/* Primary Quota Block */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-green-ink block">
              Tu cuota estimada
            </span>
            <div
              ref={paymentRef}
              className="font-extrabold text-navy leading-none tabular-nums text-3xl sm:text-4xl lg:text-[42px] tracking-tight"
            >
              <span>${fmtCOP(sim.payment)}</span>{' '}
              <span className="text-sm sm:text-base font-semibold text-muted-2">
                {sim.unit}
              </span>
            </div>
          </div>

          {/* Key Financial Breakdown (Total + Interests + Rate) */}
          <div className="space-y-2.5 sm:border-l sm:border-green/20 sm:pl-5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">Total con intereses:</span>
              <span className="font-bold text-navy tabular-nums">${fmtCOP(sim.totalCost)} COP</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">Interés estimado:</span>
              <span className="font-semibold text-navy tabular-nums">${fmtCOP(interestCost)} COP</span>
            </div>
            <div className="pt-1.5 border-t border-green/20 flex items-center justify-between text-[11px] sm:text-xs text-muted-2">
              <span className="text-green-ink font-medium">Tasa fija: {fmtPct(sim.periodRate, 1)}% m.v.</span>
              <span className="font-medium text-navy">TEA: {fmtPct(sim.ea, 2)}% E.A.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
