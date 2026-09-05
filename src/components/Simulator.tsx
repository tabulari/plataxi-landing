'use client';

import { useRef, useState, useEffect } from 'react';
import { fmtCOP, type Frequency } from '@/lib/credit';
import { useSimulator } from './simulator-store';
import { ChipRadioGroup } from './ChipRadioGroup';
import { ApplyButton } from './ApplyButton';
import { AmountInput } from './simulator/AmountInput';
import { SimulationResults } from './simulator/SimulationResults';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
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

      {/* Term Slider — flexible 1-6 meses (was fixed chips) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <p className="text-sm font-bold text-navy" id="plazoLabel">
            Elige el plazo
          </p>
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary-surface border border-primary-brand text-primary-dark text-sm font-bold tabular-nums min-w-[84px]">
            {term} {term === 1 ? 'mes' : 'meses'}
          </span>
        </div>
        {(() => {
          const minTerm = Math.min(...termOptions);
          const maxTerm = Math.max(...termOptions);
          const pct = ((term - minTerm) / (maxTerm - minTerm || 1)) * 100;
          return (
            <>
              <div className="relative w-full h-12 flex items-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-border rounded-full overflow-hidden pointer-events-none" aria-hidden="true">
                  <div className="h-full bg-green rounded-full transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }} />
                </div>
                <input
                  type="range"
                  min={minTerm}
                  max={maxTerm}
                  step={1}
                  value={term}
                  aria-label="Plazo en meses"
                  aria-valuemin={minTerm}
                  aria-valuemax={maxTerm}
                  aria-valuenow={term}
                  aria-valuetext={`${term} meses`}
                  aria-labelledby="plazoLabel"
                  onChange={(e) => {
                    markInteract('term');
                    setTerm(Number(e.target.value));
                  }}
                  className="relative w-full h-12 min-h-[48px] appearance-none bg-transparent cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 rounded-full [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-green [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.18)] [&::-webkit-slider-thumb]:cursor-pointer motion-safe:[&::-webkit-slider-thumb]:hover:scale-110 motion-safe:[&::-webkit-slider-thumb]:active:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[2.5px] [&::-moz-range-thumb]:border-green [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.18)] [&::-moz-range-thumb]:cursor-pointer motion-safe:[&::-moz-range-thumb]:hover:scale-110 motion-safe:[&::-moz-range-thumb]:active:scale-125 [&::-moz-range-thumb]:transition-transform"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-2 tabular-nums px-1 -mt-1">
                <span>{minTerm} mes</span>
                <span>{maxTerm} meses</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Payment Frequency Selector — 4 options: Diario, Semanal, Quincenal, Mensual */}
      <div>
        <p className="text-sm font-bold text-navy mb-2.5" id="freqLabel">
          Frecuencia de pago
        </p>
        <ChipRadioGroup
          className="flex flex-wrap gap-2"
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
          Pedir mi crédito
        </ApplyButton>
      </div>
    </form>
  );
}
