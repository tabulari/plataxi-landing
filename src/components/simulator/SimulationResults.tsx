'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { fmtCOP, fmtPct, type Frequency } from '@/lib/credit';
import { config } from '@/lib/config';
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

      {/* Servicios Opcionales — microcopy + inline expand + link with anchor */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">Servicios opcionales</span>
        </div>

        {/* 1. Servicio de Plataforma */}
        <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2 transition-colors">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="opt-platform"
              checked={acceptsPlatform}
              onChange={(e) => setAcceptsPlatform(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded accent-green border-border cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <div className="flex-1 text-xs min-w-0">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="opt-platform" className="font-bold text-navy dark:text-foreground cursor-pointer min-h-[44px] flex items-center -my-1 py-1 gap-1.5">
                  Servicio de Plataforma <span className="font-normal text-muted-foreground">· {fmtPct(platformFeeRate, 1)}%</span>
                </label>
                <span
                  className={`text-xs font-bold tabular-nums transition-[color,opacity] duration-200 ease-out shrink-0 ${acceptsPlatform ? 'text-navy dark:text-foreground' : 'text-muted-foreground line-through opacity-60'}`}
                >
                  +${fmtCOP(acceptsPlatform ? platformAmount : Math.round(sim.amount * platformFeeRate))}
                </span>
              </div>
              <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug">
                Desembolso en 15 min, historial en vivo y recordatorios WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => {
                  const willOpen = !showPlatformHelp;
                  setShowPlatformHelp(willOpen);
                  if (willOpen && typeof window !== 'undefined' && window.innerWidth < 600) setShowGuaranteeHelp(false);
                }}
                className="text-[11px] text-muted-foreground font-semibold underline underline-offset-2 mt-1.5 hover:text-navy dark:hover:text-foreground inline-flex items-center gap-1 cursor-pointer min-h-[44px] py-2 -ml-1 px-1"
                aria-expanded={showPlatformHelp}
                aria-controls="platform-help"
              >
                <Info size={14} aria-hidden="true" className="shrink-0" /> {showPlatformHelp ? 'Ocultar detalle' : 'Ver detalles'}
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
                aria-label="Detalle Servicio de Plataforma"
                className="text-[11px] text-foreground bg-muted/40 border border-border p-3 rounded-lg space-y-1.5"
              >
              <div className="font-semibold text-navy dark:text-foreground">¿Por qué es mejor usar Plataforma PLATAXI?</div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Recibes tu dinero en 15 min.</li>
                <li>Consulta tus pagos e historial cuando quieras.</li>
                <li>Subes de nivel para montos de préstamos más altos.</li>
                <li>Recibes recordatorios para que nunca se te pase una cuota.</li>
                <li>Pagos más seguros y tu comprobante al instante.</li>
              </ul>
              <div className="text-muted-foreground pt-1 border-t border-border">
                <strong>Si no lo autorizas:</strong> Desembolso bancario ordinario (24 a 48h hábiles) y soporte manual.
              </div>
              <div className="pt-0.5">
                <Link href="/legal/terminos#servicios-opcionales" className="text-navy dark:text-foreground hover:underline font-bold">
                  Ver detalles en Términos y Condiciones
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* 2. Fianza de Respaldo */}
        <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2 transition-colors">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="opt-guarantee"
              checked={acceptsGuarantee}
              onChange={(e) => setAcceptsGuarantee(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded accent-green border-border cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <div className="flex-1 text-xs min-w-0">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="opt-guarantee" className="font-bold text-navy dark:text-foreground cursor-pointer min-h-[44px] flex items-center -my-1 py-1 gap-1.5">
                  Fianza de Respaldo <span className="font-normal text-muted-foreground">· {fmtPct(guaranteeFeeRate, 1)}%</span>
                </label>
                <span
                  className={`text-xs font-bold tabular-nums transition-[color,opacity] duration-200 ease-out shrink-0 ${acceptsGuarantee ? 'text-navy dark:text-foreground' : 'text-muted-foreground line-through opacity-60'}`}
                >
                  +${fmtCOP(acceptsGuarantee ? guaranteeAmount : Math.round(sim.amount * guaranteeFeeRate))}
                </span>
              </div>
              <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug">
                Prórroga de hasta 2 días sin cobro de mora ni reporte.
              </p>
              <button
                type="button"
                onClick={() => {
                  const willOpen = !showGuaranteeHelp;
                  setShowGuaranteeHelp(willOpen);
                  if (willOpen && typeof window !== 'undefined' && window.innerWidth < 600) setShowPlatformHelp(false);
                }}
                className="text-[11px] text-muted-foreground font-semibold underline underline-offset-2 mt-1.5 hover:text-navy dark:hover:text-foreground inline-flex items-center gap-1 cursor-pointer min-h-[44px] py-2 -ml-1 px-1"
                aria-expanded={showGuaranteeHelp}
                aria-controls="guarantee-help"
              >
                <Info size={14} aria-hidden="true" className="shrink-0" /> {showGuaranteeHelp ? 'Ocultar detalle' : 'Ver detalles'}
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
                aria-label="Detalle Fianza de Respaldo"
                className="text-[11px] text-foreground bg-muted/40 border border-border p-3 rounded-lg space-y-1.5"
              >
              <div className="font-semibold text-navy dark:text-foreground">Fianza: Tu respaldo cuando lo necesites</div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Si un día no puedes pagar, prórroga por 2 días tu pago.</li>
                <li>No afecta tu historial.</li>
                <li>Acumulas prórrogas si nunca las has utilizado, para otros préstamos.</li>
              </ul>
              <div className="text-muted-foreground pt-1 border-t border-border">
                <strong>Si no lo autorizas:</strong> Cobro de intereses moratorios inmediatos ante cualquier retraso.
              </div>
              <div className="pt-0.5">
                <Link href="/legal/terminos#servicios-opcionales" className="text-navy dark:text-foreground hover:underline font-bold">
                  Ver detalles en Términos y Condiciones
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cláusula Contractual Literal de Inmutabilidad */}
      <div className="text-[11px] text-muted-foreground text-center pt-2 leading-relaxed">
        La persona no puede cambiar ni el plazo ni la forma de pago después de tomado el crédito.{' '}
        <Link href="/legal/terminos#inmutabilidad" className="font-bold underline text-foreground hover:text-green-ink">
          Ver Términos y Condiciones
        </Link>
        .
      </div>
    </div>
  );
}
