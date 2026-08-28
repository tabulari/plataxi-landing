'use client';

import { CheckIcon, ClockIcon } from '../icons';

export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Stage {
  id: StageId;
  label: string;
  shortLabel: string;
  description: string;
}

export const STAGES: Stage[] = [
  { id: 1, label: 'Solicitud Recibida', shortLabel: 'Solicitud', description: 'Tus datos fueron registrados correctamente en el sistema.' },
  { id: 2, label: 'Verificación de Identidad', shortLabel: 'Identidad', description: 'Revisión documental KYC y validación de seguridad.' },
  { id: 3, label: 'Evaluación de Crédito', shortLabel: 'Evaluación', description: 'Estudio scoring automático según políticas SFC.' },
  { id: 4, label: 'Oferta Lista', shortLabel: 'Oferta', description: 'Tus condiciones aprobadas y calendario final listo.' },
  { id: 5, label: 'Firma de Contrato', shortLabel: 'Firma OTP', description: 'Aceptación de Pagaré con firma electrónica OTP.' },
  { id: 6, label: 'Desembolso', shortLabel: 'Desembolso', description: 'Transferencia directa a tu cuenta bancaria o Nequi.' },
  { id: 7, label: 'Mi Crédito Activo', shortLabel: 'Activo', description: 'Crédito vigente con plan de cuotas y pagos.' },
];

export function SevenStageStepper({ currentStage }: { currentStage: StageId }) {
  return (
    <div className="w-full bg-white border border-border rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Estado de tu solicitud</h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-tint text-green-ink border border-green/20 tabular-nums">
          Paso {currentStage} de 7: {STAGES[currentStage - 1].shortLabel}
        </span>
      </div>

      {/* Horizontal desktop / scrollable stepper */}
      <div className="relative flex items-center justify-between w-full overflow-x-auto pb-3 pt-1 no-scrollbar">
        <div className="absolute left-0 top-4 h-0.5 w-full bg-border -z-0" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-green transition-all duration-500 -z-0"
          style={{ width: `${((currentStage - 1) / 6) * 100}%` }}
        />

        {STAGES.map((s) => {
          const isCompleted = s.id < currentStage;
          const isCurrent = s.id === currentStage;

          return (
            <div key={s.id} className="flex flex-col items-center min-w-[80px] sm:min-w-[100px] z-10 px-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all tabular-nums ${
                  isCompleted
                    ? 'bg-green-ink text-white shadow-sm ring-4 ring-green-tint'
                    : isCurrent
                    ? 'bg-navy text-white ring-4 ring-navy/10 animate-pulse motion-reduce:animate-none'
                    : 'bg-white border-2 border-border text-muted-2'
                }`}
              >
                {isCompleted ? (
                  <CheckIcon size={18} />
                ) : isCurrent ? (
                  <ClockIcon size={18} />
                ) : (
                  s.id
                )}
              </div>

              <span
                className={`text-[11px] font-semibold mt-2 text-center leading-tight max-w-[84px] ${
                  isCurrent
                    ? 'text-navy font-bold'
                    : isCompleted
                    ? 'text-green-ink'
                    : 'text-muted-2'
                }`}
              >
                {s.shortLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current stage description card */}
      <div className="mt-3 p-3.5 rounded-lg bg-bg-soft border border-border/80 flex items-start gap-3">
        <div className="p-2 rounded-md bg-white border border-border text-navy flex-shrink-0">
          <ClockIcon size={20} className="text-green" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-navy">{STAGES[currentStage - 1].label}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{STAGES[currentStage - 1].description}</p>
        </div>
      </div>
    </div>
  );
}
