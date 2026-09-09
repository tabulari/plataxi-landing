'use client';

import { useActiveSubmission } from '@/hooks/use-active-submission';
import { ApplyButton } from './ApplyButton';

export function HeroActiveNotice() {
  const submission = useActiveSubmission();

  if (!submission) return null;

  return (
    <div
      role="status"
      aria-label="Estado de solicitud activa"
      className="inline-flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-3.5 py-2 sm:py-1.5 rounded-2xl sm:rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-sm max-w-full"
    >
      {/* Row 1: dot + label */}
      <span className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-green shrink-0 animate-pulse" aria-hidden="true" />
        <span className="truncate">
          Tu solicitud está en evaluación
        </span>
      </span>
      {/* Row 2 mobile / inline desktop: radicado + cta */}
      <span className="flex items-center gap-2 pl-4 sm:pl-0">
        <span className="text-white/40 hidden sm:inline" aria-hidden="true">·</span>
        <b className="font-bold text-white tabular-nums text-xs">{submission.radicado}</b>
        <span className="text-white/40" aria-hidden="true">·</span>
        <ApplyButton
          origin="hero"
          variant="ghost"
          className="text-xs sm:text-sm font-bold text-green hover:text-green-bright p-0 h-auto bg-transparent hover:bg-transparent shadow-none underline underline-offset-2 cursor-pointer focus-visible:ring-1 focus-visible:ring-green shrink-0"
        >
          Ver estado
        </ApplyButton>
      </span>
    </div>
  );
}
