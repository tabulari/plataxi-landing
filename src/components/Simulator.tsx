'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { fmtCOP, type Frequency } from '@/lib/credit';
import { useSimulator } from './simulator-store';
import { ChipRadioGroup } from './ChipRadioGroup';
import { ApplyButton } from './ApplyButton';
import { AmountInput } from './simulator/AmountInput';
import { SimulationResults } from './simulator/SimulationResults';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'biweekly', label: 'Quincenal' },
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
    frequency,
    sim,
    setAmount,
    setTerm,
    setFrequency,
  } = useSimulator();
  const terms = useMemo(
    () => termOptions.map((value) => ({ value, label: `${value} meses` })),
    [termOptions],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const simRef = useRef<HTMLFormElement>(null);
  const [inputText, setInputText] = useState(() => fmtCOP(amount));
  const [hint, setHint] = useState('');

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
      className="bg-card border border-green/20 border-t-[3px] border-t-green/40 rounded-2xl p-5 sm:p-8 shadow-[0_0_0_1px_rgba(30,158,85,0.08),0_12px_32px_rgba(17,17,16,0.07)] space-y-6"
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

      {/* Term Selector */}
      <div>
        <p className="text-sm font-bold text-navy mb-2.5" id="plazoLabel">
          Elige el plazo
        </p>
        <ChipRadioGroup
          className="flex flex-wrap gap-2"
          ariaLabelledBy="plazoLabel"
          hideCheck
          options={terms}
          value={term}
          onChange={(v) => { markInteract('term'); setTerm(v); }}
        />
      </div>

      {/* Payment Frequency Selector */}
      <div>
        <p className="text-sm font-bold text-navy mb-2.5" id="freqLabel">
          Frecuencia de pago
        </p>
        <ChipRadioGroup
          className="flex gap-2.5 max-w-xs"
          ariaLabelledBy="freqLabel"
          chipClassName="chip-freq"
          hideCheck
          options={FREQUENCIES}
          value={frequency}
          onChange={(v) => { markInteract('frequency'); setFrequency(v); }}
        />
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {debouncedSr}
      </div>

      {/* Distilled Fintech Results Card */}
      <SimulationResults sim={sim} frequency={frequency} />

      {/* Action CTA & Single Quiet Trust Line */}
      <div className="pt-2 space-y-2.5">
        <p
          className={cn('text-sm text-error font-medium transition-all', sim.valid ? 'h-0 overflow-hidden' : 'h-auto mb-2')}
          role={sim.valid ? undefined : 'alert'}
          aria-live="polite"
          aria-hidden={sim.valid ? true : undefined}
        >
          {sim.valid ? '' : sim.message}
        </p>
        <ApplyButton origin="simulator" variant="default" size="block" disabled={!sim.valid} className="w-full min-h-[52px] h-[52px] bg-green text-ink hover:bg-green-bright disabled:opacity-40 shadow-md hover:shadow-lg transition-[transform,opacity,background-color,box-shadow] active:scale-[0.96] text-base font-bold border-0">
          Pedir este crédito
        </ApplyButton>
      </div>
    </form>
  );
}
