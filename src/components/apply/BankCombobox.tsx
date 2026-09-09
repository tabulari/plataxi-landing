'use client';

import { useState, useRef, useEffect } from 'react';
import { COLOMBIAN_BANKS } from '@/lib/banks';
import { cn } from '@/lib/utils';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query
    ? (COLOMBIAN_BANKS as readonly string[]).filter((b) =>
        b.toLowerCase().includes(query.toLowerCase()),
      )
    : (COLOMBIAN_BANKS as readonly string[]);

  function select(bank: string) {
    onChange(bank);
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

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  const displayValue = isOpen ? query : value;

  return (
    <div className={cn('flex flex-col gap-1.5 relative', error && '[&_input]:border-destructive')}>
      <span className="text-sm font-semibold text-foreground">Entidad bancaria</span>
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
          'h-11 min-h-[44px] w-full rounded-xl border border-gray-300 bg-white px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow,transform] placeholder:text-muted-foreground focus:border-primary-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]',
          value && !isOpen && 'font-medium',
        )}
      />
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          id="bank-listbox"
          role="listbox"
          aria-label="Entidades bancarias de Colombia"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1"
        >
          {filtered.map((bank, i) => (
            <li
              key={bank}
              id={`bank-opt-${i}`}
              role="option"
              aria-selected={bank === value}
              onMouseDown={(e) => {
                e.preventDefault();
                select(bank);
              }}
              className={cn(
                'px-3.5 py-2.5 text-sm cursor-pointer leading-snug transition-colors',
                i === highlighted
                  ? 'bg-primary-brand/20 text-navy font-medium'
                  : bank === value
                  ? 'bg-muted text-navy font-medium'
                  : 'text-foreground hover:bg-muted',
              )}
            >
              {bank}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg px-3.5 py-3 text-sm text-muted-foreground">
          No se encontraron entidades
        </div>
      )}
      <FieldError id="err-bank" message={error} />
    </div>
  );
}
