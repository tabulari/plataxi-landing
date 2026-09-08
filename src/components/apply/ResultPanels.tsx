'use client';

import { config } from '@/lib/config';
import { CheckIcon, AlertCircleIcon } from '../icons';

const WHATSAPP_FOLLOWUP_MESSAGE =
  'Hola, quiero hacer seguimiento a mi solicitud de crédito.';

export function ApplicationSuccess({
  radicado,
  workspaceUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submittedAt,
  onNewApplication,
}: {
  radicado: string;
  workspaceUrl?: string | null;
  submittedAt?: number | null;
  onNewApplication?: () => void;
}) {
  const cta = workspaceUrl
    ? { href: workspaceUrl, label: 'Ir a mi espacio de crédito' }
    : {
        href: `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(WHATSAPP_FOLLOWUP_MESSAGE)}`,
        label: 'Continuar el seguimiento por WhatsApp',
      };
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-8">
      <div className="w-[72px] h-[72px] rounded-full bg-green flex items-center justify-center mb-4 sm:mb-5 shadow-lg animate-[popIn_0.4s_cubic-bezier(0.2,1.4,0.4,1)] motion-reduce:animate-none">
        <CheckIcon size={40} className="text-ink" />
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-navy">¡Solicitud enviada con éxito!</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-[380px]">
        {workspaceUrl
          ? 'Recibimos tu solicitud y la estamos evaluando. Puedes hacer seguimiento en tiempo real desde tu espacio digital.'
          : 'Recibimos tu solicitud y la estamos evaluando. Te contactaremos para continuar con tu proceso.'}
      </p>

      <div className="mt-4 flex flex-col items-center gap-1 bg-muted/80 border border-border rounded-xl px-5 py-3 text-sm">
        <span className="text-xs text-muted-foreground font-medium">Radicado de solicitud</span>
        <b className="text-navy font-extrabold text-base tracking-wide tabular-nums">{radicado}</b>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-dark bg-green/20 px-2.5 py-0.5 rounded-full mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          En evaluación
        </span>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-green text-ink font-bold hover:bg-green-bright border-0 transition-all shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
        >
          <span>{cta.label}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      {onNewApplication && (
        <button
          type="button"
          onClick={onNewApplication}
          className="mt-4 text-xs font-semibold text-muted-foreground hover:text-navy underline underline-offset-4 transition-colors min-h-[44px] px-3 py-2 flex items-center justify-center cursor-pointer"
        >
          ¿Deseas iniciar una nueva solicitud?
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
  backend: {
    title: 'Nuestro sistema está tardando más de lo normal',
    body: 'No fue un problema de tu conexión. Tus datos siguen guardados — puedes reintentar el envío en unos momentos.',
  },
};

const DEFAULT_ERROR_COPY: SubmitErrorCopy = {
  title: 'No pudimos enviar tu solicitud',
  body: 'Ocurrió un problema de conexión. Tus datos siguen guardados — puedes reintentar el envío.',
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
