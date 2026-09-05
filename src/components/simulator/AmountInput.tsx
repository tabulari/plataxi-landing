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

        <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-[12px] p-2 border-2 border-border focus-within:border-green transition-colors">
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
              aria-describedby={hint ? 'amountHint' : undefined}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
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

        <p
          id="amountHint"
          role="status"
          aria-live="polite"
          className={`text-xs font-medium text-orange-ink mt-1.5 pl-1 ${hint ? 'block' : 'sr-only'}`}
          aria-hidden={!hint || undefined}
        >
          {hint || ' '}
        </p>
      </div>

      {/* Range Slider — presets removed per humanizer audit; slider + −/+ now handle mobile. Track reliably at 8px after 166 fix. */}
      <div className="space-y-2.5">
        <div className="relative w-full h-12 flex items-center">
          {/* Track — 8px pill, overflow-hidden so fill caps are always rounded */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-border rounded-full overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="h-full bg-green rounded-full transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }} />
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
            className="relative w-full h-12 min-h-[48px] appearance-none bg-transparent cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 rounded-full [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-green [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.18)] [&::-webkit-slider-thumb]:cursor-pointer motion-safe:[&::-webkit-slider-thumb]:hover:scale-110 motion-safe:[&::-webkit-slider-thumb]:active:scale-125 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[2.5px] [&::-moz-range-thumb]:border-green [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.18)] [&::-moz-range-thumb]:cursor-pointer motion-safe:[&::-moz-range-thumb]:hover:scale-110 motion-safe:[&::-moz-range-thumb]:active:scale-125 [&::-moz-range-thumb]:transition-transform"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-2 tabular-nums px-1">
          <span>${fmtCOP(amountMin)}</span>
          <span>${fmtCOP(amountMax)}</span>
        </div>
      </div>
    </div>
  );
}
