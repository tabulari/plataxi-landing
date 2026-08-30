'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ApplyButton } from './ApplyButton';
import { cn } from '@/lib/utils';
import { config } from '@/lib/config';
import { CloseIcon, HamburgerIcon, PlataxiWordmark } from './icons';

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
          ? 'bg-[#fffee9] shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-[#fffee9] shadow-none',
      )}
    >
      <div className="mx-auto max-w-container px-6 flex items-center justify-between h-[68px]">
        <a
          href="#top"
          aria-label={`${config.brandName} — inicio`}
          className="flex items-center py-2 text-navy"
        >
          <PlataxiWordmark height={28} variant="dark" />
        </a>

        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-semibold transition-colors py-3.5 relative after:content-[''] after:absolute after:bottom-px after:left-0 after:h-0.5 after:bg-green after:transition-[width] after:duration-200",
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
            className="hidden md:inline-flex min-h-[44px] bg-green text-ink hover:bg-green-bright border-0"
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
        {/* Backdrop Scrim */}
        {open && (
          <div
            className="fixed inset-0 top-[68px] bg-black/25 backdrop-blur-[2px] z-40 md:hidden animate-fade-in"
            onClick={close}
            aria-hidden="true"
          />
        )}

        {/* Floating Overlay Menu Panel */}
        <div
          id="navMobile"
          ref={mobilePanelRef}
          inert={!open || undefined}
          className={cn(
            'absolute top-full left-0 right-0 z-50 bg-[#fffee9] border-b border-border/80 shadow-2xl transition-all duration-200 ease-out',
            open
              ? 'opacity-100 translate-y-0 pointer-events-auto visible'
              : 'opacity-0 -translate-y-2 pointer-events-none invisible',
          )}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a, button'))
              close();
          }}
        >
          <div className="px-6 py-5 flex flex-col gap-1.5 border-t border-border/40">
            {LINKS.map((l, i) => {
              const isActive = activeId === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  className={cn(
                    'text-base font-semibold py-3 px-3 rounded-xl transition-colors',
                    isActive
                      ? 'text-navy bg-green/25 font-bold'
                      : 'text-muted-2 hover:text-navy hover:bg-black/5',
                  )}
                >
                  {l.label}
                </a>
              );
            })}
            <ApplyButton variant="default" size="lg" className="w-full min-h-[50px] mt-3 font-bold">
              Iniciar solicitud
            </ApplyButton>
          </div>
        </div>
      </nav>
    </header>
  );
}
