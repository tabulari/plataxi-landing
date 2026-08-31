'use client';

import { fmtCOP } from '@/lib/credit';
import { clampAmount, clampRoundAmount } from '../simulator-store';
import { MinusIcon, PlusIcon } from '../icons';

export function AmountInput({
  amount,
  amountMin,
  amountMax,
  amountStep,
  amountStepBig,
  setAmount,
  inputText,
  setInputText,
  hint,
  setHint,
  inputRef,
  markInteract,
}: {
  amount: number;
  amountMin: number;
  amountMax: number;
  amountStep: number;
  amountStepBig: number;
  setAmount: (v: number, round?: boolean) => void;
  inputText: string;
  setInputText: (v: string) => void;
  hint: string;
  setHint: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  markInteract: (control: string) => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markInteract('amount');
    const digits = e.target.value.replace(/\D/g, '');
    setInputText(digits ? fmtCOP(parseInt(digits, 10)) : '');
    if (!digits) {
      setHint(`Ingresa un monto entre $${fmtCOP(amountMin)} y $${fmtCOP(amountMax)}.`);
      return;
    }
    const raw = parseInt(digits, 10);
    if (raw > amountMax) setHint(`El monto máximo es $${fmtCOP(amountMax)}.`);
    else if (raw < amountMin) setHint(`El monto mínimo es $${fmtCOP(amountMin)}.`);
    else setHint('');
    setAmount(clampAmount(raw, amountMin, amountMax), false);
  };

  const handleInputBlur = () => {
    setHint('');
    const v = clampRoundAmount(amount || amountMin, amountMin, amountMax, amountStep);
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markInteract('slider');
    setHint('');
    const v = Number(e.target.value);
    setAmount(v, true);
    setInputText(fmtCOP(clampRoundAmount(v, amountMin, amountMax, amountStep)));
  };

  const bump = (dir: -1 | 1) => {
    setHint('');
    const v = clampRoundAmount(
      (amount || amountMin) + dir * amountStepBig,
      amountMin,
      amountMax,
      amountStep,
    );
    setAmount(v, true);
    setInputText(fmtCOP(v));
  };

  const pct = ((amount - amountMin) / (amountMax - amountMin)) * 100;

  return (
    <div className="space-y-4">
      {/* Amount Input Control */}
      <div>
        <div className="mb-2">
          <label htmlFor="amount-input" className="text-sm font-bold text-navy">
            ¿Cuánto dinero necesitas?
          </label>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-xl p-2 border-2 border-border focus-within:border-green transition-colors shadow-2xs">
          <button
            type="button"
            aria-label="Disminuir monto"
            onClick={() => bump(-1)}
            disabled={amount <= amountMin}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 min-h-[48px] min-w-[48px] rounded-lg bg-bg-soft hover:bg-green-soft text-navy disabled:opacity-35 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            <MinusIcon size={18} />
          </button>

          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-center sm:justify-start px-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy leading-none select-none">$</span>
            <input
              id="amount-input"
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={inputText}
              aria-label="Monto solicitado"
              aria-invalid={hint ? 'true' : undefined}
              aria-describedby="amountHint"
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-full h-12 min-h-[48px] text-2xl sm:text-3xl font-extrabold text-navy outline-none bg-transparent tabular-nums tracking-tight"
            />
            <span className="text-xs font-bold text-muted-2 uppercase tracking-wider shrink-0">COP</span>
          </div>

          <button
            type="button"
            aria-label="Aumentar monto"
            onClick={() => bump(1)}
            disabled={amount >= amountMax}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 min-h-[48px] min-w-[48px] rounded-lg bg-bg-soft hover:bg-green-soft text-navy disabled:opacity-35 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            <PlusIcon size={18} />
          </button>
        </div>

        {hint && (
          <p className="text-xs font-medium text-orange-ink mt-1.5 pl-1" id="amountHint" role="status" aria-live="polite">
            {hint}
          </p>
        )}
      </div>

      {/* Preset Quick Chips (Zero Fake "Popular" Tags) & Range Slider */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-2">Montos frecuentes:</span>
          <div className="flex items-center gap-2">
            {[300000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  markInteract('preset');
                  setHint('');
                  setAmount(clampRoundAmount(preset, amountMin, amountMax, amountStep), true);
                  setInputText(fmtCOP(clampRoundAmount(preset, amountMin, amountMax, amountStep)));
                }}
                className={`inline-flex items-center justify-center px-4 h-12 min-h-[48px] text-xs font-bold rounded-lg transition-all tabular-nums ${
                  amount === preset
                    ? 'bg-secondary-surface border-2 border-primary-brand text-primary-dark shadow-xs'
                    : 'bg-white border border-secondary-border text-primary-dark hover:border-primary-brand hover:bg-secondary-surface/30'
                }`}
              >
                ${fmtCOP(preset)}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={amountMin}
          max={amountMax}
          step={amountStep}
          value={amount}
          aria-label="Selector de monto"
          aria-valuemin={amountMin}
          aria-valuemax={amountMax}
          aria-valuenow={amount}
          aria-valuetext={`$${fmtCOP(amount)} COP`}
          onChange={handleSliderChange}
          className="w-full h-12 min-h-[48px] py-[19px] box-border bg-clip-content rounded-full appearance-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-green [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.18)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[2.5px] [&::-moz-range-thumb]:border-green [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.18)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-125 [&::-moz-range-thumb]:transition-transform"
          style={{ backgroundImage: `linear-gradient(to right, var(--green) 0% ${pct}%, var(--border) ${pct}% 100%)` }}
        />
        <div className="flex justify-between text-xs text-muted-2 tabular-nums px-1">
          <span>${fmtCOP(amountMin)}</span>
          <span>${fmtCOP(amountMax)}</span>
        </div>
      </div>
    </div>
  );
}
