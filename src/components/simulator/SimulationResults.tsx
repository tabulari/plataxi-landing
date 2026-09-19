'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { fmtCOP, fmtPct, type Frequency } from '@/lib/credit';
import { config } from '@/lib/config';
import { useSimulator } from '../simulator-store';
import { cn } from '@/lib/utils';

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
  monthlyRate?: number;
  legalInterestAmount?: number;
  platformFeeAmount?: number;
  guaranteeFeeAmount?: number;
  acceptsPlatform?: boolean;
  acceptsGuarantee?: boolean;
}

export function SimulationResults({ sim }: { sim: SimData; frequency?: Frequency }) {
  const {
    acceptsPlatform,
    setAcceptsPlatform,
    acceptsGuarantee,
    setAcceptsGuarantee,
    platformFeeRate,
    guaranteeFeeRate,
  } = useSimulator();
  const paymentRef = useRef<HTMLDivElement>(null);
  const prevPayment = useRef(sim.payment);

  const [showPlatformHelp, setShowPlatformHelp] = useState(false);
  const [showGuaranteeHelp, setShowGuaranteeHelp] = useState(false);

  const displayPayment = sim.payment;

  useEffect(() => {
    const changed = sim.payment !== prevPayment.current;
    prevPayment.current = sim.payment;
    if (!changed) return;
    const el = paymentRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.hidden) return;
    const anim = el.animate(
      [
        { transform: 'scale(1)', opacity: '1', filter: 'blur(0px)' },
        { transform: 'scale(0.98)', opacity: '0.75', filter: 'blur(1.5px)' },
        { transform: 'scale(1)', opacity: '1', filter: 'blur(0px)' },
      ],
      { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' },
    );
    return () => anim.cancel();
  }, [sim.payment]);

  const platformAmount = sim.platformFeeAmount ?? (acceptsPlatform ? Math.round(sim.amount * platformFeeRate) : 0);
  const guaranteeAmount = sim.guaranteeFeeAmount ?? (acceptsGuarantee ? Math.round(sim.amount * guaranteeFeeRate) : 0);
  const monthlyRate = sim.monthlyRate ?? config.credit.monthlyRate;

  return (
    <div className="mt-6 pt-6 border-t border-border/80 space-y-4">
      {/* Result Box — Cuota Estimada */}
      <div className="rounded-xl bg-card border border-border p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-green-ink block">Tu cuota estimada</span>
          <div
            ref={paymentRef}
            className="font-extrabold text-navy leading-none tabular-nums text-[clamp(1.875rem,8vw,2.625rem)] tracking-tight inline-flex items-baseline justify-center gap-1.5 sm:gap-2"
          >
            <span>${fmtCOP(displayPayment)}</span>
            <span className="text-[clamp(0.875rem,2.5vw,1.125rem)] font-semibold text-muted-2 tracking-normal">{sim.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md pt-0.5">
            Cuota fija con interés del {fmtPct(monthlyRate * sim.term, 1)}% ({sim.term} {sim.term === 1 ? 'mes' : 'meses'})
            {acceptsPlatform || acceptsGuarantee
              ? ` + ${[
                  acceptsPlatform ? `${fmtPct(platformFeeRate, 1)}% plataforma` : null,
                  acceptsGuarantee ? `${fmtPct(guaranteeFeeRate, 1)}% fianza` : null,
                ]
                  .filter(Boolean)
                  .join(' + ')} sobre el capital`
              : ' · sin servicios opcionales'}
            .
          </p>
        </div>
      </div>

      {/* Servicios Opcionales — collapsed rows w/ disclosure; expanded adds only new info */}
      <div className="space-y-4 pt-2" data-slot="services">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">Servicios opcionales</span>
          {(acceptsPlatform || acceptsGuarantee) && (
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
              +${fmtCOP((acceptsPlatform ? platformAmount : 0) + (acceptsGuarantee ? guaranteeAmount : 0))} al total
            </span>
          )}
        </div>

        {/* 1. Servicio de plataforma */}
        <div
          className={cn(
            'rounded-xl border p-3.5 space-y-2 bg-muted/20',
            acceptsPlatform ? 'border-green/40' : 'border-border',
          )}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="opt-platform"
              checked={acceptsPlatform}
              onChange={(e) => setAcceptsPlatform(e.target.checked)}
              className="mt-0.5 h-6 w-6 rounded accent-green border-border cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <div className="flex-1 text-xs min-w-0">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="opt-platform" className="font-semibold text-navy cursor-pointer min-h-[44px] flex items-center -my-1 py-1 gap-1.5">
                  Servicio de plataforma <span className="font-normal text-muted-foreground">· {fmtPct(platformFeeRate, 1)}%</span>
                </label>
                <span
                  className={`text-sm font-semibold tabular-nums transition-[color] duration-150 ease-out shrink-0 ${acceptsPlatform ? 'text-navy' : 'text-muted-foreground line-through'}`}
                >
                  +${fmtCOP(acceptsPlatform ? platformAmount : Math.round(sim.amount * platformFeeRate))}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                Desembolso en 15 min, historial en vivo y recordatorios WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => {
                  const willOpen = !showPlatformHelp;
                  setShowPlatformHelp(willOpen);
                  if (willOpen && typeof window !== 'undefined' && window.innerWidth < 600) setShowGuaranteeHelp(false);
                }}
                className="text-xs text-muted-foreground font-medium mt-1 hover:text-navy inline-flex items-center gap-1 cursor-pointer min-h-[44px] py-2 -ml-1 px-1"
                aria-expanded={showPlatformHelp}
                aria-controls="platform-help"
              >
                <Info size={14} aria-hidden="true" className="shrink-0" /> {showPlatformHelp ? 'Ocultar detalle' : 'Más detalles'}
              </button>
            </div>
          </div>

          <div
            className="grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none mt-2"
            style={{ gridTemplateRows: showPlatformHelp ? '1fr' : '0fr' }}
            aria-hidden={!showPlatformHelp}
            inert={!showPlatformHelp ? true : undefined}
          >
            <div className="overflow-hidden">
              <div
                id="platform-help"
                role="region"
                aria-label="Detalle Servicio de plataforma"
                className="text-xs text-foreground bg-muted/40 border border-border p-3 rounded-md space-y-1.5"
              >
              <div className="font-semibold text-navy">Qué incluye el Servicio de plataforma</div>
              <ul className="list-disc ps-4 space-y-0.5">
                <li>Historial de pagos en vivo cuando quieras.</li>
                <li>Acceso a montos de préstamo más altos al subir de nivel.</li>
                <li>Comprobante de pago al instante.</li>
              </ul>
              <div className="text-muted-foreground pt-1 border-t border-border">
                <strong className="font-semibold">Si no lo autorizas:</strong> Desembolso bancario ordinario (24 a 48&nbsp;h hábiles) y soporte manual.
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* 2. Fianza de respaldo */}
        <div className={cn(
          'rounded-xl border p-3.5 space-y-2 bg-muted/20',
          acceptsGuarantee ? 'border-green/40' : 'border-border',
        )}>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="opt-guarantee"
              checked={acceptsGuarantee}
              onChange={(e) => setAcceptsGuarantee(e.target.checked)}
              className="mt-0.5 h-6 w-6 rounded accent-green border-border cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <div className="flex-1 text-xs min-w-0">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="opt-guarantee" className="font-semibold text-navy cursor-pointer min-h-[44px] flex items-center -my-1 py-1 gap-1.5">
                  Fianza de respaldo <span className="font-normal text-muted-foreground">· {fmtPct(guaranteeFeeRate, 1)}%</span>
                </label>
                <span
                  className={`text-sm font-semibold tabular-nums transition-[color,opacity] duration-150 ease-out shrink-0 ${acceptsGuarantee ? 'text-navy' : 'text-muted-foreground line-through'}`}
                >
                  +${fmtCOP(acceptsGuarantee ? guaranteeAmount : Math.round(sim.amount * guaranteeFeeRate))}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                Pago aplazable hasta 2 días, sin mora ni reporte.
              </p>
              <button
                type="button"
                onClick={() => {
                  const willOpen = !showGuaranteeHelp;
                  setShowGuaranteeHelp(willOpen);
                  if (willOpen && typeof window !== 'undefined' && window.innerWidth < 600) setShowPlatformHelp(false);
                }}
                className="text-xs text-muted-foreground font-medium mt-1 hover:text-navy inline-flex items-center gap-1 cursor-pointer min-h-[44px] py-2 -ml-1 px-1"
                aria-expanded={showGuaranteeHelp}
                aria-controls="guarantee-help"
              >
                <Info size={14} aria-hidden="true" className="shrink-0" /> {showGuaranteeHelp ? 'Ocultar detalle' : 'Más detalles'}
              </button>
            </div>
          </div>

          <div
            className="grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none mt-2"
            style={{ gridTemplateRows: showGuaranteeHelp ? '1fr' : '0fr' }}
            aria-hidden={!showGuaranteeHelp}
            inert={!showGuaranteeHelp ? true : undefined}
          >
            <div className="overflow-hidden">
              <div
                id="guarantee-help"
                role="region"
                aria-label="Detalle Fianza de respaldo"
                className="text-xs text-foreground bg-muted/40 border border-border p-3 rounded-md space-y-1.5"
              >
              <div className="font-semibold text-navy">Qué incluye la Fianza de respaldo</div>
              <ul className="list-disc ps-4 space-y-0.5">
                <li>No afecta tu historial.</li>
                <li>Las prórrogas no usadas se acumulan para préstamos futuros.</li>
              </ul>
              <div className="text-muted-foreground pt-1 border-t border-border">
                <strong className="font-semibold">Si no lo autorizas:</strong> Cobro de intereses moratorios inmediatos ante cualquier retraso.
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* One legal line — clause fact inline, single anchor to the full terms */}
        <div className="text-xs text-muted-foreground leading-relaxed mt-2 mx-auto sm:mx-0">
          Al tomar el crédito, el plazo y la forma de pago quedan fijos.{' '}
          <Link href="/legal/terminos#servicios-opcionales" className="text-foreground underline hover:text-navy whitespace-nowrap">
            Ver Términos y Condiciones
          </Link>
        </div>
      </div>
    </div>
  );
}
