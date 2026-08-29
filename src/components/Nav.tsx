'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ApplyButton } from './ApplyButton';
import { cn } from '@/lib/utils';
import { config } from '@/lib/config';
import { CloseIcon, HamburgerIcon, BrandLogo } from './icons';

const LINKS = [
  { href: '#simula', label: 'Simula tu crédito' },
  { href: '#requisitos-band', label: 'Requisitos' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#preguntas', label: 'Preguntas' },
];

const SECTION_IDS = LINKS.map((l) => l.href.slice(1));

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const panel = mobilePanelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    panel.addEventListener('keydown', onTab);
    return () => panel.removeEventListener('keydown', onTab);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const hero = document.querySelector('section[aria-labelledby="hero-heading"]');
    if (!hero) return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    let heroVisible = true;

    const heroIO = new IntersectionObserver(
      ([en]) => {
        heroVisible = en.isIntersecting;
        setScrolled(!heroVisible);
      },
      { threshold: 0 },
    );
    heroIO.observe(hero);

    const sectionIO = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            setActiveId(en.target.id);
            return;
          }
        }
        const visible = sections.find(
          (s) => {
            const r = s.getBoundingClientRect();
            return r.top < window.innerHeight * 0.5 && r.bottom > 0;
          },
        );
        setActiveId(visible?.id ?? '');
      },
      { rootMargin: '-68px 0px -50% 0px', threshold: 0 },
    );
    sections.forEach((s) => sectionIO.observe(s));

    return () => {
      heroIO.disconnect();
      sectionIO.disconnect();
    };
  }, []);

  return (
    <header
      id="top"
      className={cn(
        'sticky top-0 z-50 backdrop-blur-lg transition-colors duration-200',
        scrolled
          ? 'bg-white/80 shadow-[0_1px_0_rgba(13,42,94,0.05)]'
          : 'bg-white/0 shadow-none',
      )}
    >
      <div className="mx-auto max-w-container px-6 flex items-center justify-between h-[68px]">
        <a
          href="#top"
          aria-label={`${config.brandName} — inicio`}
          className="flex items-center py-2 text-navy"
        >
          <BrandLogo height={34} />
        </a>

        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  'text-sm font-semibold transition-colors py-3.5 relative after:content-[\'\'] after:absolute after:bottom-px after:left-0 after:h-0.5 after:bg-navy after:transition-[width] after:duration-200',
                  isActive
                    ? 'text-navy after:w-full'
                    : 'text-muted-2 hover:text-navy after:w-0 hover:after:w-full',
                )}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ApplyButton
            variant="default"
            size="sm"
            className="hidden md:inline-flex min-h-[44px]"
          >
            Iniciar solicitud
          </ApplyButton>
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="navMobile"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-navy hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {open ? <CloseIcon size={26} /> : <HamburgerIcon size={26} />}
          </button>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="md:hidden">
        <div
          id="navMobile"
          ref={mobilePanelRef}
          inert={!open || undefined}
          className={cn(
            'md:hidden overflow-hidden transition-[max-height,border-color] duration-200',
            open ? 'max-h-[600px] border-t border-border' : 'max-h-0 border-t border-transparent',
          )}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a, button'))
              close();
          }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {LINKS.map((l, i) => {
              const isActive = activeId === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  className={cn(
                    'text-sm font-semibold py-3.5 px-2 -mx-2 rounded-lg transition-colors',
                    isActive
                      ? 'text-navy bg-green-tint font-bold'
                      : 'text-muted-2 hover:text-navy',
                  )}
                >
                  {l.label}
                </a>
              );
            })}
            <ApplyButton variant="default" size="default" className="w-full mt-2">
              Iniciar solicitud
            </ApplyButton>
          </div>
        </div>
      </nav>
    </header>
  );
}
