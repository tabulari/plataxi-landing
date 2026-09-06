'use client';

import { fmtCOP, type Simulation } from '@/lib/credit';
import { capFreq } from './use-application-form';

export function ModalSidebar({ frozen }: { frozen: Simulation }) {
  return (
    <aside aria-label="Resumen de simulación" className="dot-grid w-[240px] bg-surface-dark border-r border-white/10 text-white p-6 flex flex-col shrink-0 max-[760px]:w-full max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:items-center max-[760px]:p-4 max-[760px]:pr-14 max-[760px]:gap-4 tabular-nums">
      <div className="flex items-center gap-3 max-[760px]:mb-0">
        <div className="hidden max-[760px]:block text-left">
          <p className="text-xs font-semibold text-white/60 leading-none">Tu solicitud</p>
          <p className="text-base font-extrabold leading-none">
            {`$${fmtCOP(frozen.payment)}`} <small className="text-xs font-semibold text-white/60">{frozen.unit}</small>
          </p>
        </div>
      </div>
      <p className="text-sm font-semibold text-white/60 max-[760px]:hidden">Tu solicitud</p>
      <div className="text-2xl font-extrabold mt-1 max-[760px]:hidden">
        {`$${fmtCOP(frozen.payment)}`}
        <small className="text-sm font-semibold text-white/60 ml-1">{frozen.unit}</small>
      </div>
      <ul className="mt-5 flex flex-col gap-2 rounded-xl bg-white/[0.05] ring-1 ring-white/12 p-3.5 text-sm max-[760px]:mt-3 max-[760px]:w-full max-[760px]:grid max-[760px]:grid-cols-2 max-[760px]:gap-x-4 max-[760px]:gap-y-1.5 max-[760px]:p-3 max-[760px]:text-xs">
        {[['Monto', `$${fmtCOP(frozen.amount)}`], ['Plazo', `${frozen.term} meses`], ['Frecuencia', capFreq(frozen.frequency)]].map(([k, v]) => (
          <li key={k} className="flex justify-between gap-2"><span className="text-white/60">{k}</span><b>{v}</b></li>
        ))}
      </ul>
      <p className="text-xs text-white/50 mt-auto max-[760px]:mt-3 max-[760px]:w-full max-[760px]:text-center">
        Sujeto a verificación. No representa aprobación definitiva.
      </p>
    </aside>
  );
}
