'use client';

import { useEffect, useRef, useState } from 'react';
import { useApplicationForm, useDraftAutoSave, STEP_TITLES } from './apply/use-application-form';
import { ModalSidebar } from './apply/ModalSidebar';
import { Step1, Step2, Step3 } from './apply/FormSteps';
import { ApplicationSuccess, ApplicationError } from './apply/ResultPanels';
import { track } from '@/lib/analytics';
import { useSiteUi } from './site-ui';
import { useSimulator } from './simulator-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CloseIcon } from './icons';

export function ApplyModal() {
  const { applyOpen, applyOrigin, closeApply, showResumeNudge } = useSiteUi();
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
      setFrozen(simRef.current);
      form.restoreDraft();
      setMounted(true);
      document.body.style.overflow = 'hidden';
      const t1 = setTimeout(() => setShow(true), 16);
      const t2 = setTimeout(() => {
        modalRef.current?.querySelector<HTMLElement>('input, select')?.focus();
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
      setLiveMsg(`Paso ${form.step} de 3: ${STEP_TITLES[form.step]}`);
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

  const editMonto = () => {
    track('apply_edit_monto', { step: form.step });
    closeApply();
    setTimeout(() => {
      const el = document.getElementById('simula');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      showResumeNudge();
    }, 300);
  };

  if (!mounted || !frozen) return null;

  const handlers = {
    onFieldChange: form.onFieldChange,
    onFieldBlur: form.onFieldBlur,
    errors: form.errors,
  };

  const stepDot = (i: number) =>
    cn(
      'flex items-center gap-1.5 text-sm font-semibold',
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
          'relative flex w-full max-w-[860px] max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-200',
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          'max-[760px]:flex-col max-[760px]:max-h-[95vh]',
        )}
      >
        <h2 id="applyTitle" className="sr-only">Solicitud de credito</h2>
        <p className="sr-only" aria-live="polite">{liveMsg}</p>

        <button
          type="button"
          aria-label="Cerrar"
          onClick={closeApply}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-lg text-muted-2 hover:bg-bg-soft hover:text-navy transition-colors"
        >
          <CloseIcon size={22} />
        </button>

        <ModalSidebar frozen={frozen} onEditMonto={editMonto} />

        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <ol className="flex gap-5 px-6 pt-5 pb-3 border-b border-border">
            {[1, 2, 3].map((i) => (
              <li key={i} className={stepDot(i)}>
                <span className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                  i === form.step ? 'bg-navy text-white' : i < form.step || form.submitStatus === 'success' ? 'bg-green-ink text-white' : 'bg-border text-muted-2',
                )}>{i}</span>
                {STEP_TITLES[i]}
              </li>
            ))}
          </ol>

          {/* Live announcement region for step transitions and pending network submission */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {form.submitStatus === 'pending'
              ? 'Enviando tu solicitud de crédito, por favor espera un momento...'
              : form.submitStatus === 'success'
              ? `Solicitud enviada exitosamente. Tu radicado es ${form.radicado}`
              : form.submitStatus === 'error'
              ? 'Ocurrió un error al enviar la solicitud.'
              : `Paso ${form.step} de 3: ${STEP_TITLES[form.step]}`}
          </div>

          <form
            noValidate
            className="flex-1 px-6 py-5 flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              if (form.submitStatus === 'pending' || form.submitStatus === 'success') return;
              if (form.submitStatus === 'error') { form.submit(frozen); return; }
              form.onNext(frozen);
            }}
          >
            {form.submitStatus === 'success' ? (
              <ApplicationSuccess radicado={form.radicado} />
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
          </form>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border">
            {form.submitStatus === 'success' ? (
              <Button variant="default" size="block" onClick={closeApply}>Entendido</Button>
            ) : form.submitStatus === 'error' ? (
              <Button variant="default" size="block" onClick={() => form.submit(frozen)}>Reintentar envío <span aria-hidden="true">→</span></Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="default"
                  style={{ visibility: form.step > 1 ? 'visible' : 'hidden' }}
                  disabled={form.submitStatus === 'pending'}
                  onClick={() => form.setStep((s) => Math.max(1, s - 1))}
                >
                  ← Atrás
                </Button>
                <Button
                  variant="default"
                  size="default"
                  disabled={form.submitStatus === 'pending'}
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
