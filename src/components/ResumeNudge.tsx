'use client';

import { useEffect, useState } from 'react';
import { useSiteUi } from './site-ui';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ReturnArrowIcon, CloseIcon } from './icons';

export function ResumeNudge() {
  const { resumeNudgeOpen, openApply, hideResumeNudge } = useSiteUi();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (resumeNudgeOpen) {
      setMounted(true);
      const t = setTimeout(() => setShow(true), 20);
      return () => clearTimeout(t);
    }
    if (!mounted) return;
    setShow(false);
    const t = setTimeout(() => setMounted(false), 360);
    return () => clearTimeout(t);
  }, [resumeNudgeOpen, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-70 flex justify-center px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-auto flex items-center gap-4 w-full max-w-[560px] bg-white border border-border rounded-2xl shadow-lg p-3.5 pl-4.5 transition-transform duration-300 ease-out',
          show ? 'translate-y-0' : 'translate-y-[140%]',
        )}
      >
        <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-[11px] bg-green text-ink" aria-hidden="true">
          <ReturnArrowIcon size={20} />
        </span>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <strong className="text-sm font-extrabold text-navy-ink">Tienes una solicitud sin terminar</strong>
          <span className="text-xs text-muted">Ajusta tu monto y continúa donde quedaste.</span>
        </div>
        <Button
          variant="default"
          size="sm"
          className="shrink-0"
          onClick={() => {
            track('apply_resume');
            hideResumeNudge();
            openApply('resume');
          }}
        >
          Volver a tu solicitud <span aria-hidden="true">→</span>
        </Button>
        <button
          type="button"
          aria-label="Descartar"
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-muted-2 hover:bg-bg-soft hover:text-navy transition-colors"
          onClick={() => {
            track('apply_resume_dismiss');
            hideResumeNudge();
          }}
        >
          <CloseIcon size={18} />
        </button>
      </div>
    </div>
  );
}
