'use client';

import { useEffect, useRef, useState } from 'react';
import { useApplicationForm, useDraftAutoSave, STEP_TITLES } from './apply/use-application-form';
import { ModalSidebar } from './apply/ModalSidebar';
import { Step1, Step2, Step3 } from './apply/FormSteps';
import { ApplicationSuccess, ApplicationError } from './apply/ResultPanels';
import { useSiteUi } from './site-ui';
import { useSimulator } from './simulator-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CloseIcon } from './icons';

export function ApplyModal() {
  const { applyOpen, applyOrigin, closeApply } = useSiteUi();
  const { sim } = useSimulator();

  const simRef = useRef(sim);
  simRef.current = sim;

  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [frozen, setFrozen] = useState<typeof sim | null>(null);
  const [liveMsg, setLiveMsg] = useState('');

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const form = useApplicationForm(modalRef);

  useDraftAutoSave(mounted, form.values, form.consent, form.step, form.submitStatus);

  useEffect(() => {
    if (applyOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      let initialFrozen = simRef.current;
      form.restoreDraft((submittedTerms) => {
        initialFrozen = submittedTerms;
      });
      setFrozen(initialFrozen);
      setMounted(true);
      document.body.style.overflow = 'hidden';
      const t1 = setTimeout(() => setShow(true), 16);
      const t2 = setTimeout(() => {
        modalRef.current?.querySelector<HTMLElement>('input, select, a[href]')?.focus();
      }, 280);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (!mounted) return;
    setShow(false);
    document.body.style.overflow = '';
    const t = setTimeout(() => { setMounted(false); lastFocusedRef.current?.focus?.(); }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyOpen]);

  useEffect(() => {
    if (mounted && form.submitStatus !== 'success' && form.submitStatus !== 'error')
      setLiveMsg(`Paso ${form.step} de 4: ${STEP_TITLES[form.step]}`);
  }, [form.step, mounted, form.submitStatus]);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeApply(); return; }
      if (e.key !== 'Tab' || !modalRef.current) return;
      if (!modalRef.current.contains(document.activeElement)) {
        e.preventDefault();
        modalRef.current.querySelector<HTMLElement>('button, input, select, a[href], [tabindex]:not([tabindex="-1"])')?.focus();
        return;
      }
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>('button, input, select, a[href], [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetParent !== null && !(el as HTMLButtonElement).disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, closeApply]);

  useEffect(() => {
    if (!mounted || !modalRef.current) return;
    if (form.submitStatus === 'success' || form.submitStatus === 'error') {
      modalRef.current.querySelector<HTMLButtonElement>('button')?.focus();
    }
  }, [form.submitStatus, mounted]);

  if (!mounted || !frozen) return null;

  const handlers = {
    onFieldChange: form.onFieldChange,
    onFieldBlur: form.onFieldBlur,
    errors: form.errors,
  };

  const stepDot = (i: number) =>
    cn(
      'flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-colors',
      i === form.step ? 'text-navy' : i < form.step || form.submitStatus === 'success' ? 'text-ink' : 'text-muted-2',
    );

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-200',
        show ? 'bg-black/40' : 'bg-black/0 pointer-events-none',
      )}
      ref={overlayRef}
      onMouseDown={(e) => { if (e.target === overlayRef.current) closeApply(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="applyTitle"
        className={cn(
          'relative flex w-full max-w-[860px] h-[min(688px,90vh)] max-h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden transition-[transform,opacity] duration-200 ease-out',
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          'max-[760px]:flex-col max-[760px]:h-auto max-[760px]:max-h-[95vh]',
        )}
      >
        <h2 id="applyTitle" className="sr-only">Solicitud de credito</h2>
        <p className="sr-only" aria-live="polite">{liveMsg}</p>

        <ModalSidebar frozen={frozen} />

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Step header — always visible ─────────────────────────────── */}
          <div className="shrink-0 bg-card border-b border-border">
            <div className="flex items-center gap-1 pr-1">
              <ol className="flex-1 flex items-center justify-between sm:justify-start gap-0.5 sm:gap-2 px-3 sm:px-5 pt-1.5 sm:pt-2 pb-1 sm:pb-1.5" aria-label="Progreso del formulario">
              {[1, 2, 3].map((i) => {
                const isClickable = form.submitStatus !== 'success' && i < form.step;
                const isCurrent = form.submitStatus === 'success' ? i === 3 : i === form.step;
                const isCompleted = form.submitStatus === 'success' || i < form.step;
                const stepLabel = i === 1
                  ? { short: 'Datos', long: 'Tus datos' }
                  : i === 2
                  ? { short: 'Ingresos', long: 'Tus ingresos' }
                  : { short: 'Revisión', long: 'Revisión' };
                return (
                  <li key={i} className="flex items-center">
                    <button
                      type="button"
                      disabled={!isClickable && !isCurrent}
                      title={isClickable ? `Volver al paso ${i}: ${stepLabel.long}` : undefined}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`Ir a paso ${i}: ${STEP_TITLES[i]}${isCurrent ? ' (actual)' : isCompleted ? ' (completado — clic para volver)' : ' (incompleto)'}`}
                      onClick={() => { if (isClickable) form.setStep(i); }}
                      className={cn(
                        'flex items-center gap-1 sm:gap-1.5 min-h-[34px] py-0.5 px-1.5 sm:px-2 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                        stepDot(i),
                        isClickable && !isCurrent && 'bg-amber-100/80 border border-amber-300/90 hover:bg-amber-200/90 text-navy cursor-pointer shadow-2xs active:scale-95 group',
                        !isClickable && !isCurrent && 'cursor-default opacity-60',
                      )}
                    >
                      <span
                        className={cn(
                          'flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[11px] font-bold transition-all shrink-0',
                          form.submitStatus === 'success'
                            ? 'bg-amber-400 text-navy font-black ring-2 ring-amber-400/80 shadow-xs'
                            : isCurrent
                            ? 'bg-amber-400 text-navy font-black ring-2 ring-amber-400 shadow-sm scale-105'
                            : isClickable
                            ? 'bg-amber-400 text-navy font-bold ring-2 ring-amber-400/80 shadow-xs group-hover:scale-105 group-hover:bg-amber-300'
                            : 'bg-muted text-muted-2 ring-1 ring-inset ring-border',
                        )}
                      >
                        {form.submitStatus === 'success' || isClickable ? '✓' : i}
                      </span>
                      <span className={cn('whitespace-nowrap text-[11px] sm:text-xs flex items-center gap-0.5', isCurrent ? 'font-bold text-navy' : isClickable ? 'font-bold text-navy group-hover:underline' : 'font-medium')}>
                        {isClickable && !isCurrent && (
                          <span aria-hidden="true" className="font-bold text-amber-900 leading-none">←</span>
                        )}
                        <span className="sm:hidden">{stepLabel.short}</span>
                        <span className="hidden sm:inline">{stepLabel.long}</span>
                      </span>
                    </button>

                    {i < 3 && (
                      <div
                        aria-hidden="true"
                        className={cn(
                          'w-2 sm:w-4 mx-0.5 shrink transition-colors',
                          i < form.step ? 'h-[2px] bg-amber-400' : 'h-px bg-border',
                        )}
                      />
                    )}
                  </li>
                );
              })}
              </ol>

              {/* Close button — inline with step bar so it never overlaps step labels */}
              <button
                type="button"
                aria-label="Cerrar"
                onClick={closeApply}
                className="flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg bg-muted/60 text-muted-foreground hover:bg-muted hover:text-navy transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 shrink-0 mr-1.5"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Dynamic progress bar — always visible below step labels */}
            <div className="h-1 bg-muted overflow-hidden" aria-hidden="true">
              <div
                className="h-full bg-amber-400 transition-[width] duration-500 ease-out"
                style={{
                  width: `${(form.submitStatus === 'success' ? 3 : form.step) * (100 / 3)}%`,
                }}
              />
            </div>
          </div>

          {/* Live announcement region for step transitions and pending network submission */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {form.submitStatus === 'pending'
              ? 'Enviando tu solicitud de crédito, por favor espera un momento...'
              : form.submitStatus === 'success'
              ? `Solicitud enviada exitosamente. Tu radicado es ${form.radicado}`
              : form.submitStatus === 'error'
              ? 'Ocurrió un error al enviar la solicitud.'
              : `Paso ${form.step} de 4: ${STEP_TITLES[form.step]}`}
          </div>

          <form
            noValidate
            className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (form.submitStatus === 'pending' || form.submitStatus === 'success') return;
              if (form.submitStatus === 'error') { form.submit(frozen); return; }
              form.onNext(frozen);
            }}
          >
            <div
              key={`step-${form.step}-${form.submitStatus}`}
              className="flex-1 flex flex-col animate-step-in"
            >
              {form.submitStatus === 'success' ? (
                <ApplicationSuccess
                  radicado={form.radicado}
                  workspaceUrl={form.workspaceUrl}
                  submittedAt={form.submittedAt}
                  onNewApplication={() => {
                    form.startNewApplication();
                    setFrozen(simRef.current);
                  }}
                />
              ) : form.submitStatus === 'error' ? (
                <ApplicationError code={form.submitErrorCode} />
              ) : (
              <>
                {form.step === 1 && (
                  <Step1 values={form.values} applyOrigin={applyOrigin} handlers={handlers} frozen={frozen} />
                )}
                {form.step === 2 && (
                  <Step2 values={form.values} handlers={handlers} />
                )}
                {form.step === 3 && (
                  <Step3
                    values={form.values}
                    consent={form.consent}
                    consentError={form.consentError}
                    setConsent={form.setConsent}
                    setConsentError={form.setConsentError}
                    frozen={frozen}
                  />
                )}
              </>
              )}
            </div>
          </form>

          <div className="shrink-0 bg-card flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-border">
            {form.submitStatus === 'success' ? (
              <div className="flex items-center justify-between w-full gap-3">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => {
                    form.startNewApplication();
                    setFrozen(simRef.current);
                  }}
                  className="text-xs text-muted-foreground hover:text-navy"
                >
                  Nueva solicitud
                </Button>
                <Button
                  variant="default"
                  size="default"
                  className="bg-green text-ink hover:bg-green-bright border-0 font-bold"
                  onClick={closeApply}
                >
                  Entendido
                </Button>
              </div>
            ) : form.submitStatus === 'error' ? (
              <Button variant="default" size="block" className="bg-green text-ink hover:bg-green-bright border-0" onClick={() => form.submit(frozen)}>Reintentar envío <span aria-hidden="true">→</span></Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="default"
                  className={cn(
                    'border border-border bg-white text-foreground hover:bg-muted hover:text-navy font-semibold shadow-xs transition-all active:scale-[0.98]',
                    form.step === 1 && 'invisible pointer-events-none',
                  )}
                  aria-hidden={form.step === 1}
                  tabIndex={form.step === 1 ? -1 : 0}
                  disabled={form.submitStatus === 'pending'}
                  onClick={() => form.setStep((s) => Math.max(1, s - 1))}
                >
                  <span aria-hidden="true" className="font-bold">←</span> Volver
                </Button>
                <Button
                  variant="default"
                  size="default"
                  disabled={form.submitStatus === 'pending' || !form.isStepComplete}
                  onClick={() => form.onNext(frozen)}
                  className="bg-green text-ink hover:bg-green-bright border-0 disabled:opacity-40"
                >
                  {form.submitStatus === 'pending' ? (<><span className="btn-spinner" aria-hidden="true" /> Enviando…</>)
                    : form.step === 3 ? (<>Enviar solicitud <span aria-hidden="true">→</span></>)
                    : (<>Continuar <span aria-hidden="true">→</span></>)}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
