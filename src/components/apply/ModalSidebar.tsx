'use client';

import { fmtCOP, fmtPct, type Simulation } from '@/lib/credit';
import { capFreq } from './use-application-form';

export function ModalSidebar({ frozen }: { frozen: Simulation }) {

  return (
    <aside
      aria-label="Resumen de simulación"
      className="dot-grid w-[240px] bg-surface-dark border-r border-white/10 text-white p-6 flex flex-col shrink-0 max-[760px]:w-full max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:flex-row max-[760px]:items-center max-[760px]:justify-between max-[760px]:p-3.5 max-[760px]:pr-14 tabular-nums"
    >
      {/* Mobile Compact Header (<760px) */}
      <div className="hidden max-[760px]:flex items-center justify-between w-full gap-3 text-left">
        <div>
          <span className="text-xs font-semibold text-white/70 block leading-none mb-2">Tu solicitud</span>
          <span className="text-lg font-extrabold text-white leading-none">
            {`$${fmtCOP(frozen.payment)}`}{' '}
            <span className="text-xs font-semibold text-white/60">{frozen.unit}</span>
          </span>
        </div>
        <span className="text-xs font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
          {`$${fmtCOP(frozen.amount)} · ${frozen.term}m`}
        </span>
      </div>

      {/* Desktop Rich Sidebar (>=760px) */}
      <p className="text-xs uppercase tracking-wider font-bold text-white/60 mb-2.5 max-[760px]:hidden">Tu solicitud</p>
      <div className="text-2xl font-extrabold max-[760px]:hidden tracking-tight">
        {`$${fmtCOP(frozen.payment)}`}
        <small className="text-sm font-semibold text-white/60 ml-1.5">{frozen.unit}</small>
      </div>
      <ul className="mt-5 flex flex-col gap-2 rounded-xl bg-white/[0.05] ring-1 ring-white/12 p-3.5 text-sm max-[760px]:hidden">
        {[
          ['Monto', `$${fmtCOP(frozen.amount)}`],
          ['Plazo', `${frozen.term} meses`],
          ['Nº pagos', String(Math.round(frozen.nPeriods))],
          ['Tasa/período', `${fmtPct(frozen.periodRate, 2)}%`],
          ['Frecuencia', capFreq(frozen.frequency)],
        ].map(([k, v]) => (
          <li key={k} className="flex justify-between gap-2">
            <span className="text-white/60">{k}</span><b>{v}</b>
          </li>
        ))}
      </ul>

      {calc && (
        <div className="mt-4 rounded-xl bg-white/[0.06] ring-1 ring-white/10 p-3 text-xs max-[760px]:hidden">
          <p className="text-white/50 mb-1.5 uppercase tracking-wider font-semibold text-[10px]">Cálculo estimado</p>
          <p className="font-mono text-white/90 text-[11px] leading-relaxed">{calc.formula}</p>
          <p className="text-white/50 mt-1 text-[10px] leading-relaxed">{calc.legend}</p>
        </div>
      )}

      <p className="text-xs text-white/50 mt-auto max-[760px]:hidden">
        Sujeto a verificación. No representa aprobación definitiva.
      </p>
    </aside>
  );
}
