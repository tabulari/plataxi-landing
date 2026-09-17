'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { fmtCOP, type Frequency } from '@/lib/credit';
import { useSimulator } from '../simulator-store';

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
  legalInterestAmount?: number;
  platformFeeAmount?: number;
  guaranteeFeeAmount?: number;
  acceptsPlatform?: boolean;
  acceptsGuarantee?: boolean;
}

export function SimulationResults({ sim, frequency }: { sim: SimData; frequency: Frequency }) {
  const { acceptsPlatform, setAcceptsPlatform, acceptsGuarantee, setAcceptsGuarantee } = useSimulator();
  const paymentRef = useRef<HTMLDivElement>(null);
  const prevPayment = useRef(sim.payment);

  const [showPlatformHelp, setShowPlatformHelp] = useState(false);
  const [showGuaranteeHelp, setShowGuaranteeHelp] = useState(false);

  const displayPayment =
    sim.payment >= 10000
      ? Math.round(sim.payment / 1000) * 1000
      : Math.round(sim.payment / 100) * 100;

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

  const platformAmount = sim.platformFeeAmount ?? (acceptsPlatform ? Math.round(sim.amount * 0.030) : 0);
  const guaranteeAmount = sim.guaranteeFeeAmount ?? (acceptsGuarantee ? Math.round(sim.amount * 0.036) : 0);

  return (
    <div className="mt-6 pt-6 border-t border-border/80 space-y-4">
      {/* Result Box — Cuota Estimada */}
      <div className="rounded-2xl bg-gradient-to-br from-green-tint/70 to-secondary-surface/40 border border-green/30 p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-green-ink block">Tu cuota estimada</span>
          <div
            ref={paymentRef}
            className="font-extrabold text-navy leading-none tabular-nums text-3xl sm:text-4xl lg:text-[42px] tracking-tight inline-flex items-baseline justify-center gap-1.5 sm:gap-2"
          >
            <span>${fmtCOP(displayPayment)}</span>
            <span className="text-base sm:text-lg font-semibold text-muted-2 tracking-normal">{sim.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md pt-0.5">
            Cuota periódica fija con interés legal del 3.4% mensual.
          </p>
        </div>
      </div>

      {/* Servicios Opcionales con microcopy y tooltip desplegable (Cero modales) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Servicios opcionales
          </span>
        </div>

        {/* 1. Servicio de Plataforma */}
        <div className="rounded-xl border border-amber-300/80 bg-amber-50/50 dark:border-amber-700/50 dark:bg-amber-950/20 p-3.5 space-y-2 transition-colors">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="opt-platform"
              checked={acceptsPlatform}
              onChange={(e) => setAcceptsPlatform(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-amber-500 focus:ring-amber-400 border-amber-300 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="opt-platform" className="font-bold text-navy dark:text-foreground cursor-pointer">
                  Servicio de Plataforma
                </label>
                {acceptsPlatform && (
                  <span className="text-xs font-bold text-navy dark:text-foreground tabular-nums">
                    +${fmtCOP(platformAmount)}
                  </span>
                )}
              </div>
              {/* Microcopy pedido */}
              <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug">
                Desembolso en 15 min, historial en vivo y recordatorios WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setShowPlatformHelp(!showPlatformHelp)}
                className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-2 mt-1 hover:text-navy inline-flex items-center gap-1 cursor-pointer"
                aria-expanded={showPlatformHelp}
              >
                <span>ℹ️ {showPlatformHelp ? 'Ocultar detalle' : 'Ver detalle pequeño'}</span>
              </button>
            </div>
          </div>

          {/* Tooltip / Texto pequeño desplegable (en la misma tarjeta) */}
          {showPlatformHelp && (
            <div className="text-[11px] text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 p-3 rounded-lg border border-amber-200 dark:border-amber-800/40 space-y-1.5 mt-2 animate-in fade-in duration-150">
              <div className="font-semibold text-navy dark:text-foreground">¿Por qué es mejor usar Plataforma PLATAXI?</div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Recibes tu dinero en 15 min.</li>
                <li>Consulta tus pagos e historial cuando quieras.</li>
                <li>Subes de nivel para montos de préstamos más altos.</li>
                <li>Recibes recordatorios para que nunca se te pase una cuota.</li>
                <li>Pagos más seguros y tu comprobante al instante.</li>
              </ul>
              <div className="text-amber-900 dark:text-amber-300 pt-1 border-t border-amber-100 dark:border-white/5">
                <strong>Si no lo autorizas:</strong> Desembolso bancario ordinario (24 a 48h hábiles) y soporte manual.
              </div>
              <div className="pt-0.5">
                <Link href="/legal/terminos#servicios-opcionales" className="text-navy hover:text-amber-800 dark:text-amber-300 font-bold underline">
                  Ver detalles en Términos y Condiciones
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 2. Fianza de Respaldo */}
        <div className="rounded-xl border border-amber-300/80 bg-amber-50/50 dark:border-amber-700/50 dark:bg-amber-950/20 p-3.5 space-y-2 transition-colors">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="opt-guarantee"
              checked={acceptsGuarantee}
              onChange={(e) => setAcceptsGuarantee(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-amber-500 focus:ring-amber-400 border-amber-300 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="opt-guarantee" className="font-bold text-navy dark:text-foreground cursor-pointer">
                  Fianza de Respaldo
                </label>
                {acceptsGuarantee && (
                  <span className="text-xs font-bold text-navy dark:text-foreground tabular-nums">
                    +${fmtCOP(guaranteeAmount)}
                  </span>
                )}
              </div>
              {/* Microcopy pedido */}
              <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug">
                Prórroga de hasta 2 días sin cobro de mora ni reporte.
              </p>
              <button
                type="button"
                onClick={() => setShowGuaranteeHelp(!showGuaranteeHelp)}
                className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-2 mt-1 hover:text-navy inline-flex items-center gap-1 cursor-pointer"
                aria-expanded={showGuaranteeHelp}
              >
                <span>ℹ️ {showGuaranteeHelp ? 'Ocultar detalle' : 'Ver detalle pequeño'}</span>
              </button>
            </div>
          </div>

          {/* Tooltip / Texto pequeño desplegable (en la misma tarjeta) */}
          {showGuaranteeHelp && (
            <div className="text-[11px] text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 p-3 rounded-lg border border-amber-200 dark:border-amber-800/40 space-y-1.5 mt-2 animate-in fade-in duration-150">
              <div className="font-semibold text-navy dark:text-foreground">Fianza: Tu respaldo cuando lo necesites</div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Si un día no puedes pagar, prórroga por 2 días tu pago.</li>
                <li>No afecta tu historial.</li>
                <li>Acumulas prórrogas si nunca las has utilizado, para otros préstamos.</li>
              </ul>
              <div className="text-amber-900 dark:text-amber-300 pt-1 border-t border-amber-100 dark:border-white/5">
                <strong>Si no lo autorizas:</strong> Cobro de intereses moratorios inmediatos ante cualquier retraso.
              </div>
              <div className="pt-0.5">
                <Link href="/legal/terminos#servicios-opcionales" className="text-navy hover:text-amber-800 dark:text-amber-300 font-bold underline">
                  Ver detalles en Términos y Condiciones
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Cláusula Contractual Literal de Inmutabilidad */}
      <div className="text-[11px] text-muted-foreground text-center pt-2 leading-relaxed">
        La persona no puede cambiar ni el plazo ni la forma de pago después de tomado el crédito.{' '}
        <Link href="/legal/terminos" className="font-bold underline text-foreground hover:text-green-ink">
          Ver Términos y Condiciones
        </Link>
        .
      </div>
    </div>
  );
}
