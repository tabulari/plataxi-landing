'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { fmtCOP, validateApplication, isTermDisabled, isFrequencyDisabled, type Frequency } from '@/lib/credit';
import { useSimulator } from './simulator-store';
import { ChipRadioGroup } from './ChipRadioGroup';
import { ApplyButton } from './ApplyButton';
import { AmountInput } from './simulator/AmountInput';
import { SimulationResults } from './simulator/SimulationResults';
import { summaryBreakdown } from './apply/summary';
import { FieldError } from './FieldError';
import { track } from '@/lib/analytics';
import { clearDraft, clearSubmittedApplication } from '@/lib/draft-storage';
import { useActiveSubmission } from '@/hooks/use-active-submission';
import { cn } from '@/lib/utils';

const ALL_FREQUENCIES: { value: Frequency; label: string; estimate?: true }[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'bimonthly', label: 'Bimestral', estimate: true },
  { value: 'quarterly', label: 'Trimestral', estimate: true },
];

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: 'Arma tu crédito',
  2: 'Tu cuota',
  3: 'Tu solicitud',
};

export function Simulator() {
  const {
    amount,
    amountMax,
    amountMin,
    amountStep,
    amountStepBig,
    term,
    termOptions,
    offeredFrequencies,
    frequency,
    sim,
    setAmount,
    setTerm,
    setFrequency,
  } = useSimulator();

  const frequencies = useMemo(
    () =>
      ALL_FREQUENCIES.filter((f) => offeredFrequencies.includes(f.value)).map((f) => {
        const disabled = isFrequencyDisabled(amount, f.value);
        let title: string | undefined;
        if (disabled) {
          if (amount <= 150000) title = 'Solo pago diario disponible hasta $150.000';
          else if (amount < 300000) title = 'Disponible: diario o semanal';
          else if (amount < 600000) title = 'Mensual disponible desde $600.000';
        }
        return { ...f, disabled, title };
      }),
    [offeredFrequencies, amount],
  );

  const terms = useMemo(
    () =>
      termOptions.map((value) => {
        const disabled = isTermDisabled(amount, value);
        let title: string | undefined;
        if (disabled) {
          if (value === 2) {
            title = 'Disponible a partir de $200.000';
          } else if (value >= 3) {
            title = 'Disponible a partir de $300.000';
          }
        }
        return {
          value,
          label: `${value} ${value === 1 ? 'mes' : 'meses'}`,
          disabled,
          title,
        };
      }),
    [termOptions, amount],
  );

  // 5. Validación instantánea (amount vivo) para que hint y CTA/mensaje estén sincronizados
  // sim usa settledAmount (150ms debounce) solo para la cuota; validación no debe laggear
  const liveValidity = useMemo(
    () => validateApplication(amount, term, frequency),
    [amount, term, frequency],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const simRef = useRef<HTMLFormElement>(null);
  const [inputText, setInputText] = useState(() => fmtCOP(amount));
  const [hint, setHint] = useState('');
  const [snapAnnouncement, setSnapAnnouncement] = useState('');
  const activeSubmission = useActiveSubmission();

  // Wizard estilo Dribbble: paso 1 = formulario, paso 2 = cuota, paso 3 = solicitud
  // editable que reemplaza el sidebar oscuro del modal. Si hay solicitud activa al
  // montar, se arranca en el paso 2 (antes el banner era visible de inmediato).
  const [step, setStep] = useState<1 | 2 | 3>(activeSubmission ? 2 : 1);
  const stepHeadingRef = useRef<HTMLParagraphElement>(null);
  const prevStepRef = useRef(step);
  const goStep = (next: 1 | 2 | 3) => {
    if (next === step) return;
    setStep(next);
    track('sim_step', { step: next });
  };
  useEffect(() => {
    if (prevStepRef.current !== step) {
      prevStepRef.current = step;
      stepHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  // Anuncio accesible cuando el plazo o forma de pago hacen auto-snap por cambio de monto
  const prevTermRef = useRef(term);
  const prevFrequencyRef = useRef(frequency);
  useEffect(() => {
    if (prevTermRef.current !== term) {
      const msg = `Plazo ajustado a ${term} ${term === 1 ? 'mes' : 'meses'}`;
      setSnapAnnouncement(msg);
      const t = setTimeout(() => setSnapAnnouncement(''), 3000);
      prevTermRef.current = term;
      return () => clearTimeout(t);
    }
    prevTermRef.current = term;
  }, [term]);
  useEffect(() => {
    if (prevFrequencyRef.current !== frequency) {
      const labels: Record<string, string> = { daily: 'diaria', weekly: 'semanal', biweekly: 'quincenal', monthly: 'mensual' };
      const msg = `Forma de pago ajustada a ${labels[frequency] ?? frequency}`;
      setSnapAnnouncement(msg);
      const t = setTimeout(() => setSnapAnnouncement(''), 3000);
      prevFrequencyRef.current = frequency;
      return () => clearTimeout(t);
    }
    prevFrequencyRef.current = frequency;
  }, [frequency]);

  // 1. Sync inputText cuando amount cambia externamente (clamp de rates, auto-snap de plazo)
  // No pisa mientras el usuario está tipeando (input enfocado)
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputText(fmtCOP(amount));
    }
  }, [amount]);

  const interacted = useRef(false);
  const markInteract = (control: string) => {
    if (interacted.current) return;
    interacted.current = true;
    track('sim_interact', { control });
  };

  const srText = `Cuota estimada: $${fmtCOP(sim.payment)} ${sim.unit}. Monto: $${fmtCOP(sim.amount)}, plazo: ${sim.term} ${sim.term === 1 ? 'mes' : 'meses'}.`;
  const [debouncedSr, setDebouncedSr] = useState(srText);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSr(srText), 150);
    return () => clearTimeout(id);
  }, [srText]);

  // El paso 3 muestra exactamente el mismo desglose que congela el modal al
  // abrirse: ambos leen este mismo objeto sim a través de summaryBreakdown.
  const summary = useMemo(() => summaryBreakdown(sim), [sim]);

  return (
    <form
      ref={simRef}
      id="simulator"
      aria-label="Simulador de crédito"
      onSubmit={(e) => e.preventDefault()}
      className="bg-white border border-border/80 rounded-none p-5 sm:p-6 shadow-sm space-y-5"
    >
      {/* Indicador de paso (wizard estilo Dribbble) — recibe foco al cambiar de paso */}
      <p
        ref={stepHeadingRef}
        tabIndex={-1}
        aria-live="polite"
        className="text-xs font-bold uppercase tracking-wider text-muted-foreground outline-none"
      >
        {`Paso ${step} de 3 — ${STEP_TITLES[step]}`}
      </p>

      {/* Paso 1 — formulario (monto, plazo, frecuencia) + NEXT */}
      {step === 1 ? (
      <div className="space-y-5 min-w-0">
      {/* Amount Input with Stepper & Slider */}
      <AmountInput
        amount={amount}
        amountMin={amountMin}
        amountMax={amountMax}
        amountStep={amountStep}
        amountStepBig={amountStepBig}
        setAmount={setAmount}
        inputText={inputText}
        setInputText={setInputText}
        hint={hint}
        setHint={setHint}
        inputRef={inputRef}
        markInteract={markInteract}
      />

      {/* Plazo — chips 1-3 con reglas de disponibilidad según monto */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2" id="plazoLabel">
          Plazos
        </p>
        <ChipRadioGroup
          className="grid grid-cols-3 gap-2.5"
          ariaLabelledBy="plazoLabel"
          ariaDescribedBy="plazoHint"
          options={terms}
          value={term}
          onChange={(v) => {
            markInteract('term');
            setTerm(v);
          }}
        />
        <p id="plazoHint" className="text-xs text-muted-foreground mt-1.5 min-h-[18px]" aria-live="polite">
          {amount <= 150000
            ? 'Plazo disponible: 1 mes'
            : amount < 300000
              ? 'Plazo disponible: hasta 2 meses'
              : '\u00A0'}
        </p>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {snapAnnouncement} {debouncedSr}
      </div>

      {/* Payment Frequency / Forma de pago Selector */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2" id="freqLabel">
          Forma de pago
        </p>
        <ChipRadioGroup
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
          ariaLabelledBy="freqLabel"
          ariaDescribedBy="freqHint"
          options={frequencies.map((f) => ({
            value: f.value,
            label: f.estimate ? `${f.label} *` : f.label,
            disabled: f.disabled,
            title: (f as { title?: string }).title,
          }))}
          value={frequency}
          onChange={(v) => { markInteract('frequency'); setFrequency(v); }}
        />
        <p id="freqHint" className="text-xs text-muted-foreground mt-1.5 min-h-[18px]" aria-live="polite">
          {frequencies.find((f) => f.value === frequency)?.estimate
            ? '* Cuota estimada. El cargo definitivo se confirma en la oferta.'
            : frequencies.some((f) => f.estimate)
              ? 'Las opciones con * son estimadas.'
              : '\u00A0'}
        </p>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {debouncedSr}
      </div>

      {/* NEXT estilo Dribbble */}
      <div className="pt-1 space-y-2.5">
        <FieldError
          message={liveValidity.ok ? '' : liveValidity.message}
          reserveSpace={false}
          iconSize={15}
          className={cn('text-sm transition-all', liveValidity.ok ? 'h-0 overflow-hidden' : 'h-auto mb-2')}
          role={liveValidity.ok ? undefined : 'alert'}
          aria-live="polite"
          aria-hidden={liveValidity.ok ? true : undefined}
        />
        <button
          type="button"
          onClick={() => goStep(2)}
          disabled={!liveValidity.ok}
          className="w-full min-h-[48px] rounded-none bg-primary-brand text-primary-dark hover:bg-primary-brand/90 disabled:opacity-40 shadow-sm hover:shadow-md transition-[transform,opacity,background-color,box-shadow] active:scale-[0.96] text-base font-bold border-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-brand focus-visible:ring-offset-2"
        >
          Ver mi cuota →
        </button>
      </div>
      </div>
      ) : step === 2 ? (
      <div className="space-y-4 min-w-0">
      {/* Paso 2 — resumen de cuota + avance a la solicitud */}
      <button
        type="button"
        onClick={() => goStep(1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-navy underline underline-offset-4 cursor-pointer py-1.5 min-h-[44px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green rounded-none"
      >
        ← Ajustar monto o plazo
      </button>
      {/* Distilled Fintech Results Card - sim usa settledAmount para cuota estable, pero validación es instantánea */}
      <SimulationResults sim={sim} frequency={frequency} />

      {/* Action CTA & Single Quiet Trust Line */}
      <div className="pt-1 space-y-2.5">
        {activeSubmission && (
          <div
            role="status"
            aria-label="Solicitud activa encontrada"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-none bg-green/10 border border-green/30 text-xs sm:text-sm text-navy"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-green shrink-0 animate-pulse" aria-hidden="true" />
              <span className="min-w-0 break-words">
                Tu solicitud está en evaluación (Radicado:{' '}
                <b className="font-bold tabular-nums">{activeSubmission.radicado}</b>)
              </span>
            </span>
            <ApplyButton
              origin="resume"
              variant="ghost"
              className="text-sm font-bold text-navy hover:text-navy underline underline-offset-2 min-h-[44px] px-2 -my-1 flex items-center shrink-0 bg-transparent hover:bg-transparent shadow-none self-end sm:self-center cursor-pointer focus-visible:ring-2 focus-visible:ring-green"
            >
              Ver estado
            </ApplyButton>
          </div>
        )}
        <button
          type="button"
          onClick={() => goStep(3)}
          disabled={!liveValidity.ok}
          className="w-full min-h-[48px] rounded-none bg-primary-brand text-primary-dark hover:bg-primary-brand/90 disabled:opacity-40 shadow-sm hover:shadow-md transition-[transform,opacity,background-color,box-shadow] active:scale-[0.96] text-base font-bold border-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-brand focus-visible:ring-offset-2"
        >
          Ver mi solicitud →
        </button>
      </div>
      </div>
      ) : (
      <div className="space-y-4 min-w-0">
      {/* Paso 3 — la solicitud completa sobre fondo blanco, con plazo y forma de
          pago aún editables. Los números salen del mismo snapshot que congela el
          modal al abrirse, así que lo que se ve aquí es lo que se verá allá. */}
      <button
        type="button"
        onClick={() => goStep(2)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-navy underline underline-offset-4 cursor-pointer py-1.5 min-h-[44px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green rounded-none"
      >
        ← Volver a ver mi cuota
      </button>

      {/* Cuota destacada */}
      <div className="bg-secondary-surface border border-border/80 rounded-none px-4 py-3.5 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tu cuota</p>
        <p className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight tabular-nums leading-tight mt-1">
          {summary.payment}
          <span className="text-base font-bold text-muted-foreground ml-1">{summary.unit}</span>
        </p>
      </div>

      {/* Detalle de la solicitud — los mismos datos que mostraba el sidebar oscuro */}
      <dl className="border border-border/80 rounded-none divide-y divide-border/80 tabular-nums">
        {summary.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3 px-4 py-2.5">
            <dt className="text-xs sm:text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-bold text-navy text-right">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-[11px] leading-relaxed text-muted-foreground -mt-1">{summary.note}</p>

      {/* Plazo y forma de pago siguen ajustables desde aquí */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2" id="reqTermLabel">
          Plazos
        </p>
        <ChipRadioGroup
          className="grid grid-cols-3 gap-2.5"
          ariaLabelledBy="reqTermLabel"
          options={terms}
          value={term}
          onChange={(v) => {
            markInteract('term');
            setTerm(v);
          }}
        />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2" id="reqFreqLabel">
          Forma de pago
        </p>
        <ChipRadioGroup
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
          ariaLabelledBy="reqFreqLabel"
          options={frequencies.map((f) => ({
            value: f.value,
            label: f.estimate ? `${f.label} *` : f.label,
            disabled: f.disabled,
            title: (f as { title?: string }).title,
          }))}
          value={frequency}
          onChange={(v) => { markInteract('frequency'); setFrequency(v); }}
        />
        <p className="text-xs text-muted-foreground mt-1.5 min-h-[18px]">
          {frequencies.find((f) => f.value === frequency)?.estimate
            ? '* Cuota estimada. El cargo definitivo se confirma en la oferta.'
            : frequencies.some((f) => f.estimate)
              ? 'Las opciones con * son estimadas.'
              : '\u00A0'}
        </p>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {debouncedSr}
      </div>

      {/* Aceptar = el CTA final, que vive en este paso */}
      <div className="pt-1 space-y-2.5">
        <FieldError
          id="simulator-error"
          message={liveValidity.ok ? '' : liveValidity.message}
          reserveSpace={false}
          iconSize={15}
          className={cn('text-sm transition-[opacity,transform] duration-150 ease-out', liveValidity.ok ? 'h-0 overflow-hidden opacity-0' : 'h-auto mb-2 opacity-100')}
          role={liveValidity.ok ? undefined : 'alert'}
          aria-live="polite"
          aria-hidden={liveValidity.ok ? true : undefined}
        />
        <ApplyButton
          origin="simulator"
          variant="default"
          size="block"
          aria-describedby={liveValidity.ok ? undefined : 'simulator-error'}
          className="w-full min-h-[52px] py-3 rounded-none bg-primary-brand text-primary-dark hover:bg-primary-brand/90 shadow-sm hover:shadow-md transition-[transform,opacity,background-color,box-shadow] active:scale-[0.96] text-base font-bold border-0 cursor-pointer"
        >
          Pedir mi crédito
        </ApplyButton>
        {activeSubmission && (
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                clearSubmittedApplication();
                clearDraft();
              }}
              className="text-xs text-muted-foreground hover:text-navy underline underline-offset-4 cursor-pointer min-h-[44px] px-2 -my-1 inline-flex items-center transition-colors"
            >
              Iniciar nueva solicitud
            </button>
          </div>
        )}
      </div>
      </div>
      )}
    </form>
  );
}
