'use client';

import { config } from '@/lib/config';
import { fmtCOP, fmtPct, type Simulation } from '@/lib/credit';
import { capFreq } from './use-application-form';

export function ModalSidebar({ frozen }: { frozen: Simulation }) {
  // Tasas servidas por Core y congeladas en el snapshot; los ?? cubren
  // snapshots previos a las tasas dinámicas (config = literales históricos).
  const monthlyRate = frozen.monthlyRate ?? config.credit.monthlyRate;
  const platformRate = frozen.platformFeeRate ?? config.credit.platformFeeRate;
  const guaranteeRate = frozen.guaranteeFeeRate ?? config.credit.guaranteeFeeRate;
  const legalInterest = frozen.legalInterestAmount ?? Math.round(frozen.amount * monthlyRate * frozen.term);
  const platformFee = frozen.platformFeeAmount ?? 0;
  const guaranteeFee = frozen.guaranteeFeeAmount ?? 0;

  return (
    <aside
      aria-label="Resumen de simulación"
      className="dot-grid w-[260px] bg-surface-dark border-r border-white/10 text-white p-5 flex flex-col shrink-0 max-[760px]:w-full max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:flex-row max-[760px]:items-center max-[760px]:justify-between max-[760px]:p-3.5 max-[760px]:pr-14 tabular-nums"
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
      <p className="text-xs uppercase tracking-wider font-bold text-white/60 mb-2 max-[760px]:hidden">Tu solicitud</p>
      <div className="text-2xl font-extrabold max-[760px]:hidden tracking-tight">
        {`$${fmtCOP(frozen.payment)}`}
        <small className="text-sm font-semibold text-white/60 ml-1.5">{frozen.unit}</small>
      </div>

      <ul className="mt-4 flex flex-col gap-1.5 rounded-xl bg-white/[0.05] ring-1 ring-white/12 p-3 text-xs max-[760px]:hidden">
        <li className="flex justify-between gap-2">
          <span className="text-white/60">Capital</span><b>${fmtCOP(frozen.amount)}</b>
        </li>
        <li className="flex justify-between gap-2">
          <span className="text-white/60">Plazo</span><b>{frozen.term} {frozen.term === 1 ? 'mes' : 'meses'}</b>
        </li>
        <li className="flex justify-between gap-2">
          <span className="text-white/60">Forma de pago</span><b>{capFreq(frozen.frequency)}</b>
        </li>
        <li className="flex justify-between gap-2">
          <span className="text-white/60">Nº pagos</span><b>{Math.round(frozen.nPeriods)} cuotas</b>
        </li>
        <li className="flex justify-between gap-2">
          <span className="text-white/60">Interés Legal ({fmtPct(monthlyRate * frozen.term, 1)}%)</span><b>${fmtCOP(legalInterest)}</b>
        </li>
        {platformFee > 0 && (
          <li className="flex justify-between gap-2">
            <span className="text-white/60">Plataforma ({fmtPct(platformRate, 1)}%)</span><b>${fmtCOP(platformFee)}</b>
          </li>
        )}
        {guaranteeFee > 0 && (
          <li className="flex justify-between gap-2">
            <span className="text-white/60">Fianza ({fmtPct(guaranteeRate, 1)}%)</span><b>${fmtCOP(guaranteeFee)}</b>
          </li>
        )}
      </ul>

      {/* Cláusula de inmutabilidad contractual */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] text-white/80 leading-snug max-[760px]:hidden">
        <b className="font-semibold text-white">Condición inmutable:</b> La persona no puede cambiar ni el plazo ni la forma de pago después de tomado el crédito.
      </div>

      <p className="text-[11px] text-white/50 mt-auto pt-3 max-[760px]:hidden">
        {frozen.isEstimate
          ? 'Cuota estimada. Cargo definitivo se confirma en la oferta.'
          : 'Sujeto a verificación. No representa aprobación definitiva.'}
      </p>
    </aside>
  );
}
