"use client";

import { useRef } from "react";
import { VerifiedCircleIcon } from "./icons";

/**
 * Accessible chip radiogroup (ported from `app.js` setupRadioGroup). Implements
 * role="radiogroup"/role="radio" + aria-checked, roving tabindex (active = 0,
 * others = −1), and full keyboard nav: Arrow (Left/Right/Up/Down), Home, End,
 * Space/Enter. State is conveyed by more than color (green ring + check icon).
 */

const Check = () => (
  <span className="ck" aria-hidden="true">
    <VerifiedCircleIcon size={16} />
  </span>
);

interface Option<T> {
  value: T;
  label: string;
  disabled?: boolean;
  title?: string;
}

export function ChipRadioGroup<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
  chipClassName,
  checkBefore = false,
  hideCheck = false,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string;
  className: string;
  chipClassName?: string;
  checkBefore?: boolean;
  hideCheck?: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = options.findIndex((o) => o.value === value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = activeIndex < 0 ? 0 : activeIndex;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      // skip disabled
      let n = (i + 1) % options.length;
      for (let k = 0; k < options.length; k++) {
        if (!options[n].disabled) { next = n; break; }
        n = (n + 1) % options.length;
      }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      let n = (i - 1 + options.length) % options.length;
      for (let k = 0; k < options.length; k++) {
        if (!options[n].disabled) { next = n; break; }
        n = (n - 1 + options.length) % options.length;
      }
    } else if (e.key === "Home") {
      next = options.findIndex((o) => !o.disabled);
    } else if (e.key === "End") {
      for (let k = options.length - 1; k >= 0; k--) if (!options[k].disabled) { next = k; break; }
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!options[i].disabled) onChange(options[i].value);
      return;
    }
    if (next !== null && next >= 0) {
      e.preventDefault();
      onChange(options[next].value);
      refs.current[next]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {options.map((o, i) => {
        const active = o.value === value;
        const disabled = !!o.disabled;
        return (
          <button
            key={String(o.value)}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : active ? 0 : -1}
            disabled={disabled}
            title={o.title}
            aria-label={disabled && o.title ? `${o.label} — ${o.title}` : undefined}
            className={`chip${active ? " active" : ""}${chipClassName ? ` ${chipClassName}` : ""}${disabled ? " opacity-40 cursor-not-allowed" : ""}`}
            onClick={() => { if (!disabled) onChange(o.value); }}
          >
            {!hideCheck && checkBefore && <Check />}
            {o.label}
            {!hideCheck && !checkBefore && (
              <>
                {" "}
                <Check />
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
