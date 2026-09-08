'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { fmtCOP, validateApplication, isTermDisabled, type Frequency } from '@/lib/credit';
import { config } from '@/lib/config';
import { useSimulator } from './simulator-store';
import { ChipRadioGroup } from './ChipRadioGroup';
import { ApplyButton } from './ApplyButton';
import { AmountInput } from './simulator/AmountInput';
import { SimulationResults } from './simulator/SimulationResults';
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
    () => ALL_FREQUENCIES.filter((f) => offeredFrequencies.includes(f.value)),
    [offeredFrequencies],
  );
  const isMinAmount = amount <= amountMin;
  const isHighAmount = amount > config.credit.highAmountThreshold;
  const terms = useMemo(
    () =>
      termOptions.map((value) => {
        const disabled = isTermDisabled(amount, value);
        let reason: string | undefined;
        if (disabled) {
          reason = isMinAmount
            ? `Solo 1 mes disponible para $${fmtCOP(amountMin)}`
            : `Plazo mínimo ${config.credit.highAmountMinTerm} meses para montos superiores a $${fmtCOP(config.credit.highAmountThreshold)}`;
        }
        return {
          value,
          label: `${value} ${value === 1 ? 'mes' : 'meses'}`,
          disabled,
          title: reason,
        };
      }),
    [termOptions, amount, amountMin, isMinAmount, isHighAmount],
  );

  // 5. Validación instantánea (amount vivo) para que chips/hint y CTA/mensaje estén sincronizados
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

  // 9. Anuncio accesible cuando el plazo hace auto-snap (sin animación silenciosa)
  const prevTermRef = useRef(term);
  useEffect(() => {
    if (prevTermRef.current !== term && (isMinAmount || isHighAmount)) {
      const msg =
        term === 1
          ? `Plazo ajustado a 1 mes para $${fmtCOP(amountMin)}`
          : `Plazo ajustado a ${term} meses para montos superiores a $${fmtCOP(config.credit.highAmountThreshold)}`;
      setSnapAnnouncement(msg);
      const t = setTimeout(() => setSnapAnnouncement(''), 3000);
      // flash visual sutil en el radiogroup
      const el = document.getElementById('plazoGroup');
      if (el) {
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 300);
      }
      prevTermRef.current = term;
      return () => clearTimeout(t);
    }
    prevTermRef.current = term;
  }, [term, isMinAmount, isHighAmount, amountMin]);

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

  const srText = `Cuota estimada: $${fmtCOP(sim.payment)} ${sim.unit}. Monto: $${fmtCOP(sim.amount)}, plazo: ${sim.term} meses.`;
  const [debouncedSr, setDebouncedSr] = useState(srText);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSr(srText), 150);
    return () => clearTimeout(id);
  }, [srText]);

  return (
    <form
      ref={simRef}
      id="simulator"
      aria-label="Simulador de crédito"
      onSubmit={(e) => e.preventDefault()}
      className="bg-card border border-green/20 border-t-[3px] border-t-green/40 rounded-2xl p-5 sm:p-8 shadow-md space-y-6"
    >
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

      {/* Term Selector — 6 chips 1-6 meses (discrete, scannable, 1 tap) */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-1.5" id="plazoLabel">
          Elige el plazo
        </p>
        <div id="plazoGroup">
          <ChipRadioGroup
            className="flex flex-wrap gap-2"
            ariaLabelledBy="plazoLabel"
            ariaDescribedBy={isMinAmount || isHighAmount ? "plazoHint" : undefined}
            hideCheck
            options={terms}
            value={term}
            onChange={(v) => {
              markInteract('term');
              setTerm(v);
            }}
          />
        </div>
        {(isMinAmount || isHighAmount) ? (
          <p
            id="plazoHint"
            className="text-xs text-muted-foreground mt-2"
            aria-live="polite"
          >
            {isHighAmount
              ? `Para montos superiores a $${fmtCOP(config.credit.highAmountThreshold)} el plazo mínimo es ${config.credit.highAmountMinTerm} meses.`
              : `Para $${fmtCOP(amountMin)} solo está disponible 1 mes. Aumenta el monto para desbloquear 2–6 meses.`}
          </p>
        ) : null}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {snapAnnouncement}
        </div>
      </div>

      {/* Payment Frequency Selector */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-1.5" id="freqLabel">
          Frecuencia de pago
        </p>
        <ChipRadioGroup
          className="flex flex-wrap gap-2"
          ariaLabelledBy="freqLabel"
          chipClassName="chip-freq"
          hideCheck
          options={frequencies.map((f) => ({
            value: f.value,
            label: f.estimate ? `${f.label} *` : f.label,
            title: f.estimate ? 'Cuota estimada — el cargo definitivo se confirma en la oferta' : undefined,
          }))}
          value={frequency}
          onChange={(v) => { markInteract('frequency'); setFrequency(v); }}
        />
        {(frequency === 'bimonthly' || frequency === 'quarterly') && (
          <p className="text-xs text-muted-foreground mt-1.5">
            * Cuota estimada. El cargo definitivo se confirmará en la oferta.
          </p>
        )}
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {debouncedSr}
      </div>

      {/* Distilled Fintech Results Card - sim usa settledAmount para cuota estable, pero validación es instantánea */}
      <SimulationResults sim={sim} frequency={frequency} />

      {/* Action CTA & Single Quiet Trust Line */}
      <div className="pt-2 space-y-2.5">
        <FieldError
          message={liveValidity.ok ? '' : liveValidity.message}
          reserveSpace={false}
          iconSize={15}
          className={cn('text-sm transition-all', liveValidity.ok ? 'h-0 overflow-hidden' : 'h-auto mb-2')}
          role={liveValidity.ok ? undefined : 'alert'}
          aria-live="polite"
          aria-hidden={liveValidity.ok ? true : undefined}
        />
        {activeSubmission && (
          <div
            role="status"
            aria-label="Solicitud activa encontrada"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-xl bg-green/10 border border-green/30 text-xs sm:text-sm text-navy"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-green shrink-0 animate-pulse" aria-hidden="true" />
              <span className="truncate">
                Tu solicitud está en evaluación (Radicado:{' '}
                <b className="font-bold tabular-nums">{activeSubmission.radicado}</b>)
              </span>
            </span>
            <ApplyButton
              origin="simulator"
              variant="ghost"
              className="text-xs sm:text-sm font-bold text-navy hover:text-navy underline underline-offset-2 p-0 h-auto shrink-0 bg-transparent hover:bg-transparent shadow-none self-end sm:self-center cursor-pointer focus-visible:ring-1 focus-visible:ring-green"
            >
              Ver estado →
            </ApplyButton>
          </div>
        )}
        <ApplyButton
          origin="simulator"
          variant="default"
          size="block"
          disabled={!liveValidity.ok}
          className="w-full min-h-[52px] h-[52px] bg-green text-ink hover:bg-green-bright disabled:opacity-40 shadow-sm hover:shadow-md transition-[transform,opacity,background-color,box-shadow] active:scale-[0.96] text-base font-bold border-0 cursor-pointer"
        >
          {activeSubmission ? 'Ver estado de mi solicitud' : 'Pedir mi crédito'}
        </ApplyButton>
        {activeSubmission && (
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={() => {
                clearSubmittedApplication();
                clearDraft();
              }}
              className="text-xs text-muted-foreground hover:text-navy underline underline-offset-4 cursor-pointer py-1 transition-colors"
            >
              ¿Deseas simular otra cuota? Iniciar nueva solicitud
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
