'use client';

import { fmtCOP, fmtPct, type Simulation } from '@/lib/credit';
import { capFreq } from './use-application-form';
import { PencilIcon, PlataxiLogo } from '../icons';

export function ModalSidebar({ frozen, onEditMonto }: { frozen: Simulation; onEditMonto: () => void }) {
  return (
    <aside aria-label="Resumen de simulación" className="w-[240px] bg-navy-deep text-white p-6 flex flex-col shrink-0 max-[760px]:w-full max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:p-4 max-[760px]:gap-3">
      <div className="mb-4 max-[760px]:mb-0">
        <PlataxiLogo size={28} className="h-7 w-7 shrink-0" />
      </div>
      <p className="text-sm font-semibold text-white/60 max-[760px]:hidden">Tu solicitud</p>
      <div className="text-2xl font-extrabold mt-1 max-[760px]:text-lg max-[760px]:mt-0">
        {`$${fmtCOP(frozen.payment)}`}
        <small className="text-sm font-semibold text-white/60 ml-1">{frozen.unit}</small>
      </div>
      <button
        type="button"
        onClick={onEditMonto}
        className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white mt-3 max-[760px]:mt-0"
      >
        <PencilIcon size={14} />
        Editar monto
      </button>
      <ul className="mt-5 flex flex-col gap-2 text-sm max-[760px]:hidden">
        {[['Monto', `$${fmtCOP(frozen.amount)}`], ['Plazo', `${frozen.term} meses`], ['Frecuencia', capFreq(frozen.frequency)], ['Tasa', fmtPct(frozen.periodRate, 1) + (frozen.frequency === 'biweekly' ? '% q.' : '% m. v.')]].map(([k, v]) => (
          <li key={k} className="flex justify-between"><span className="text-white/60">{k}</span><b>{v}</b></li>
        ))}
      </ul>
      <p className="text-xs text-white/50 mt-auto max-[760px]:hidden">
        Sujeto a verificación. No representa aprobación definitiva.
      </p>
    </aside>
  );
}
