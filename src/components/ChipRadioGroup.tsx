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
}

export function ChipRadioGroup<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabelledBy,
  className,
  chipClassName,
  checkBefore = false,
  hideCheck = false,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabelledBy: string;
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
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = (i + 1) % options.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (i - 1 + options.length) % options.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = options.length - 1;
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(options[i].value);
      return;
    }
    if (next !== null) {
      e.preventDefault();
      onChange(options[next].value);
      refs.current[next]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={`chip${active ? " active" : ""}${chipClassName ? ` ${chipClassName}` : ""}`}
            onClick={() => onChange(o.value)}
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
