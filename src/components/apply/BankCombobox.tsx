'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { FEATURED_BANK_OPTIONS, OTHER_BANK_OPTIONS, displayBankName, type BankOption } from '@/lib/banks';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '../icons';
import { FieldError } from '../FieldError';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
};

export function BankCombobox({ value, onChange, onBlur, error }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const matches = (b: BankOption) =>
    b.display.toLowerCase().includes(query.toLowerCase()) ||
    b.legal.toLowerCase().includes(query.toLowerCase());

  const featured = query ? FEATURED_BANK_OPTIONS.filter(matches) : FEATURED_BANK_OPTIONS;
  const others = query ? OTHER_BANK_OPTIONS.filter(matches) : OTHER_BANK_OPTIONS;
  const filtered = [...featured, ...others];
  const showOthersHeader = others.length > 0;

  function updateDropdownRect() {
    if (inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setDropdownRect({ top: r.bottom, left: r.left, width: r.width });
    }
  }

  function select(bank: BankOption) {
    onChange(bank.legal);
    setQuery('');
    setIsOpen(false);
    setHighlighted(-1);
    inputRef.current?.blur();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    setHighlighted(-1);
    if (!v) onChange('');
  }

  function handleFocus() {
    updateDropdownRect();
    setQuery('');
    setIsOpen(true);
    setHighlighted(-1);
  }

  function handleBlur(e: React.FocusEvent) {
    if (listRef.current?.contains(e.relatedTarget as Node)) return;
    setIsOpen(false);
    setQuery('');
    onBlur();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        updateDropdownRect();
        setIsOpen(true);
        setHighlighted(0);
      }
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0 && filtered[highlighted]) {
      e.preventDefault();
      select(filtered[highlighted]);
    }
  }

  // Update position when highlighted item changes (scroll into view)
  useEffect(() => {
    if (highlighted >= 0) {
      document.getElementById(`bank-opt-${highlighted}`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  // Re-anchor dropdown on any ancestor scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => updateDropdownRect();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [isOpen]);

  const displayValue = isOpen ? query : displayBankName(value);

  const dropdownStyle = dropdownRect
    ? { position: 'fixed' as const, top: dropdownRect.top + 2, left: dropdownRect.left, width: dropdownRect.width, zIndex: 9999 }
    : undefined;

  // shadow replaces border so it renders uniformly on all sides without clipping
  const dropdownClass = 'bg-white rounded-xl shadow-[0_0_0_1px_theme(colors.gray.200),0_4px_16px_-2px_rgba(0,0,0,0.12)] overflow-hidden';

  return (
    <div className={cn('flex flex-col gap-1.5 relative', error && '[&_input]:border-destructive')}>
      <span className="text-sm font-semibold text-foreground">Entidad bancaria</span>
      <div className="relative">
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="bank-listbox"
          aria-activedescendant={highlighted >= 0 ? `bank-opt-${highlighted}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'err-bank' : undefined}
          name="bank"
          type="text"
          autoComplete="off"
          placeholder="Busca tu banco o entidad"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'h-11 min-h-[44px] w-full rounded-xl border border-gray-300 bg-white pl-3.5 pr-9 text-sm text-foreground outline-none transition-[border-color,box-shadow,transform] placeholder:text-muted-foreground focus:border-primary-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]',
            value && !isOpen && 'font-medium',
          )}
        />
        <ChevronDownIcon
          size={16}
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform duration-150',
            isOpen && 'rotate-180',
          )}
        />
      </div>
      {isOpen && dropdownRect && typeof document !== 'undefined' && createPortal(
        filtered.length > 0 ? (
          <ul
            ref={listRef}
            id="bank-listbox"
            role="listbox"
            aria-label="Entidades bancarias de Colombia"
            style={dropdownStyle}
            className={cn(dropdownClass, 'max-h-52 overflow-y-auto py-1')}
          >
            {filtered.map((bank, i) => (
              <Fragment key={bank.legal}>
                {i === featured.length && showOthersHeader && (
                  <li
                    key="bank-group-otros"
                    role="presentation"
                    aria-hidden="true"
                    className="px-3.5 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Otras entidades
                  </li>
                )}
                <li
                  id={`bank-opt-${i}`}
                  role="option"
                  aria-selected={bank.legal === value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(bank);
                  }}
                  className={cn(
                    'px-3.5 py-2.5 text-sm cursor-pointer leading-snug transition-colors',
                    i === highlighted
                      ? 'bg-primary-brand/20 text-navy font-medium'
                      : bank.legal === value
                      ? 'bg-muted text-navy font-medium'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  {bank.display}
                </li>
              </Fragment>
            ))}
          </ul>
        ) : (
          <div
            style={dropdownStyle}
            className={cn(dropdownClass, 'px-3.5 py-3 text-sm text-muted-foreground')}
          >
            No se encontraron entidades
          </div>
        ),
        document.body,
      )}
      <FieldError id="err-bank" message={error} />
    </div>
  );
}
