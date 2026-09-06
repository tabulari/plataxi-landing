'use client';

import { CheckIcon, AlertCircleIcon } from '../icons';

export function ApplicationSuccess({ radicado }: { radicado: string }) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
      <div className="w-[72px] h-[72px] rounded-full bg-green flex items-center justify-center mb-5 shadow-lg animate-[popIn_0.4s_cubic-bezier(0.2,1.4,0.4,1)] motion-reduce:animate-none">
        <CheckIcon size={40} className="text-ink" />
      </div>
      <h2 className="text-xl font-extrabold text-navy">¡Solicitud enviada con éxito!</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-[380px]">Recibimos tu solicitud y la estamos evaluando. Puedes hacer seguimiento en tiempo real desde tu espacio digital.</p>
      <div className="mt-4 bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-muted-foreground">Radicado <b className="text-navy font-extrabold tabular-nums">{radicado}</b></div>
      
      <a
        href={`/s/${radicado}`}
        className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-green text-ink font-bold hover:bg-green-bright border-0 transition-colors shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>Ir a mi espacio de crédito</span>
        <span aria-hidden="true">→</span>
      </a>
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
