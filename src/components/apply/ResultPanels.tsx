'use client';

import { config } from '@/lib/config';
import { CheckIcon, AlertCircleIcon } from '../icons';

const WHATSAPP_FOLLOWUP_MESSAGE =
  'Hola, quiero hacer seguimiento a mi solicitud de crédito.';

import { fmtCOP, type Simulation } from '@/lib/credit';
import { capFreq, type Values } from './use-application-form';

export function ApplicationSuccess({
  radicado,
  workspaceUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submittedAt,
  terms,
  values,
  onNewApplication,
}: {
  radicado: string;
  workspaceUrl?: string | null;
  submittedAt?: number | null;
  terms?: Simulation | null;
  values?: Partial<Values> | null;
  onNewApplication?: () => void;
}) {
  const cta = workspaceUrl
    ? { href: workspaceUrl, label: 'Ir a mi espacio de crédito' }
    : {
        href: `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(WHATSAPP_FOLLOWUP_MESSAGE)}`,
        label: 'Continuar el seguimiento por WhatsApp',
      };

  const legalInterest = terms?.legalInterestAmount ?? (terms ? Math.round(terms.amount * 0.034 * terms.term) : 0);
  const platformFee = terms?.platformFeeAmount ?? 0;
  const guaranteeFee = terms?.guaranteeFeeAmount ?? 0;

  return (
    <section className="flex-1 flex flex-col items-center text-center py-4 sm:py-6 px-1 max-w-lg mx-auto w-full">
      <div className="w-14 h-14 rounded-full bg-green flex items-center justify-center mb-3 shadow-md animate-[popIn_0.4s_cubic-bezier(0.2,1.4,0.4,1)] motion-reduce:animate-none">
        <CheckIcon size={32} className="text-ink" />
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-navy">¡Solicitud en evaluación!</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-[420px]">
        {workspaceUrl
          ? 'Recibimos tu solicitud. Puedes hacer seguimiento en tiempo real desde tu espacio digital.'
          : 'Recibimos tu solicitud y estamos revisando tus condiciones. Te contactaremos en breve.'}
      </p>

      {/* Radicado Badge */}
      <div className="mt-3.5 flex items-center justify-between gap-4 bg-muted/80 border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm w-full">
        <div className="flex flex-col text-left">
          <span className="text-[11px] text-muted-foreground font-medium">Radicado oficial</span>
          <b className="text-navy font-extrabold text-sm sm:text-base tabular-nums">{radicado}</b>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-dark bg-green/20 px-2.5 py-1 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          En evaluación
        </span>
      </div>

      {/* Resumen de Condiciones Plataxi */}
      {terms && (
        <div className="mt-3.5 w-full text-left bg-muted/40 border border-border rounded-xl p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-bold text-navy text-xs uppercase tracking-wide">Condiciones solicitadas</span>
            <span className="font-extrabold text-navy text-sm sm:text-base tabular-nums">
              ${fmtCOP(terms.payment)} <small className="text-xs text-muted-foreground font-semibold">{terms.unit}</small>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 tabular-nums text-muted-foreground">
            <div className="flex justify-between">
              <span>Capital:</span>
              <b className="text-navy">${fmtCOP(terms.amount)}</b>
            </div>
            <div className="flex justify-between">
              <span>Plazo:</span>
              <b className="text-navy">{terms.term} {terms.term === 1 ? 'mes' : 'meses'}</b>
            </div>
            <div className="flex justify-between">
              <span>Forma de pago:</span>
              <b className="text-navy">{capFreq(terms.frequency)}</b>
            </div>
            <div className="flex justify-between">
              <span>Nº cuotas:</span>
              <b className="text-navy">{Math.round(terms.nPeriods)} cuotas</b>
            </div>
            <div className="flex justify-between">
              <span>Interés Legal ({terms.monthlyRate != null ? `${(terms.monthlyRate * terms.term * 100).toFixed(1).replace('.', ',')}%` : terms.term === 1 ? '3,4%' : terms.term === 2 ? '6,8%' : '10,2%'}):</span>
              <b className="text-navy">${fmtCOP(legalInterest)}</b>
            </div>
            {platformFee > 0 && (
              <div className="flex justify-between">
                <span>Plataforma ({terms.platformFeeRate != null ? `${terms.platformFeeRate * 100}0%` : '3.0%'}):</span>
                <b className="text-navy">${fmtCOP(platformFee)}</b>
              </div>
            )}
            {guaranteeFee > 0 && (
              <div className="flex justify-between">
                <span>Fianza ({terms.guaranteeFeeRate != null ? `${terms.guaranteeFeeRate * 100}0%` : '3.6%'}):</span>
                <b className="text-navy">${fmtCOP(guaranteeFee)}</b>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Datos del solicitante si existen */}
      {values?.fullName && (
        <div className="mt-2.5 w-full text-left bg-muted/20 border border-border/70 rounded-xl px-3.5 py-2 text-[11px] text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>Titular: <b className="text-navy">{values.fullName}</b></span>
          {values.idNumber && <span>C.C.: <b className="text-navy">{values.idNumber}</b></span>}
          {values.bankEntity && <span>Banco: <b className="text-navy">{values.bankEntity}</b></span>}
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full">
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-green text-ink font-bold hover:bg-green-bright border-0 transition-[transform,opacity,background-color,box-shadow,border-color] shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] text-sm"
        >
          <span>{cta.label}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      {onNewApplication && (
        <button
          type="button"
          onClick={onNewApplication}
          className="mt-3 text-xs font-semibold text-muted-foreground hover:text-navy underline underline-offset-4 transition-colors min-h-[44px] px-3 py-1 flex items-center justify-center cursor-pointer"
        >
          Simular de nuevo
        </button>
      )}
    </section>
  );
}

type SubmitErrorCopy = {
  title: string;
  body: string;
};

const ERROR_COPY: Record<string, SubmitErrorCopy> = {
  rate_limited: {
    title: 'Son demasiadas solicitudes por ahora',
    body: 'Espera unos segundos y vuelve a intentar. Tus datos siguen guardados.',
  },
  national_id_already_registered: {
    title: 'Esa cédula ya está registrada',
    body: 'Ya existe una solicitud con este documento. Si crees que es un error, contáctanos.',
  },
  backend: {
    title: 'Nuestro sistema está tardando más de lo normal',
    body: 'No fue un problema de tu conexión. Tus datos siguen guardados. Puedes reintentar el envío en unos momentos.',
  },
};

const DEFAULT_ERROR_COPY: SubmitErrorCopy = {
  title: 'No pudimos enviar tu solicitud',
  body: 'Ocurrió un problema de conexión. Tus datos siguen guardados. Puedes reintentar el envío.',
};

export function ApplicationError({ code }: { code?: string | null }) {
  const copy = (code ? ERROR_COPY[code] : undefined) ?? DEFAULT_ERROR_COPY;
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
      <div className="w-[72px] h-[72px] rounded-full bg-muted ring-1 ring-border flex items-center justify-center mb-5 shadow-lg animate-[popIn_0.4s_cubic-bezier(0.2,1.4,0.4,1)] motion-reduce:animate-none">
        <AlertCircleIcon size={38} className="text-destructive" />
      </div>
      <h2 className="text-xl font-extrabold text-navy">{copy.title}</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-[380px]">{copy.body}</p>
    </section>
  );
}
