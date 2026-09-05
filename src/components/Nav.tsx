'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as FocusScope from '@radix-ui/react-focus-scope';
import { ApplyButton } from './ApplyButton';
import { cn } from '@/lib/utils';
import { config } from '@/lib/config';
import { CloseIcon, HamburgerIcon, PlataxiWordmark } from './icons';

const LINKS = [
  { href: '#simula', label: 'Simular cuota' },
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
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
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
    const setup = (heroEl: HTMLElement) => {
      const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
        Boolean,
      ) as HTMLElement[];

      let heroVisible = true;

      const heroIO = new IntersectionObserver(
        ([en]) => {
          heroVisible = en.isIntersecting;
          setScrolled(!heroVisible);
        },
        // -68px = bar height, so the swap fires as the hero edge slides under it
        { threshold: 0, rootMargin: '-68px 0px 0px 0px' },
      );
      heroIO.observe(heroEl);

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
    };

    let cleanup: (() => void) | undefined;
    const hero = document.querySelector('section[aria-labelledby="hero-heading"]') as HTMLElement | null;
    if (hero) {
      cleanup = setup(hero);
    } else {
      // Hero is client-rendered; observe DOM until it appears (RSC/CSR race).
      const mo = new MutationObserver(() => {
        const found = document.querySelector('section[aria-labelledby="hero-heading"]') as HTMLElement | null;
        if (found) {
          mo.disconnect();
          cleanup = setup(found);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      cleanup = () => mo.disconnect();
    }

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <header
      id="top"
      className={cn(
        // `fixed`, not `sticky`: the full-bleed hero runs underneath the bar.
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        scrolled
          // NOTE: not `bg-background/95` — Tailwind cannot inject an alpha into
          // var(--background) (the token holds a hex, not channels), so that
          // utility emits an invalid colour and renders fully transparent.
          // Solid bg-background + border replaces the ineffective backdrop-blur + shadow on opaque surface.
          ? 'bg-background border-b border-border/60 shadow-none'
          : 'bg-transparent border-b border-transparent shadow-none',
      )}
    >
      {/* Legibility scrim for the transparent state. The hero's scrim runs
          left-to-right, so it is at its thinnest under the right-hand nav
          links — measured 3.08:1 there without this. Fades out downward so the
          bar still reads as transparent rather than as a plate. */}
      {!scrolled && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-black/65 via-black/40 to-transparent pointer-events-none"
        />
      )}

      <div className="relative z-10 mx-auto max-w-container px-6 flex items-center justify-between h-[68px]">
        <a
          href="#top"
          aria-label={`${config.brandName} — inicio`}
          className="grid items-center py-2 [&>*]:col-start-1 [&>*]:row-start-1"
        >
          {/* Both variants are stacked in one grid cell and cross-faded, so the
              lockup always contrasts with whatever is behind the bar: white on
              the hero photo, dark on the page below. The anchor carries the
              accessible name, so both marks are hidden from assistive tech. */}
          <span
            aria-hidden="true"
            className={cn('transition-opacity duration-300', scrolled ? 'opacity-0' : 'opacity-100')}
          >
            <PlataxiWordmark height={28} variant="white" />
          </span>
          <span
            aria-hidden="true"
            className={cn('transition-opacity duration-300', scrolled ? 'opacity-100' : 'opacity-0')}
          >
            <PlataxiWordmark height={28} variant="dark" />
          </span>
        </a>

        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6 lg:gap-8">
          {LINKS.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "min-h-[44px] inline-flex items-center text-sm font-semibold transition-colors py-3.5 relative after:content-[''] after:absolute after:bottom-px after:left-0 after:h-0.5 after:bg-green after:transition-[width] after:duration-200 hover:scale-[1.01] active:scale-[0.98]",
                  scrolled
                    ? isActive
                      ? 'text-navy after:w-full'
                      : 'text-muted-2 hover:text-navy after:w-0 hover:after:w-full'
                    : isActive
                      ? 'text-white after:w-full'
                      : 'text-white hover:text-white after:w-0 hover:after:w-full',
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
            Pedir mi crédito
          </ApplyButton>
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="navMobile"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              'md:hidden flex items-center justify-center w-11 h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-transform hover:scale-[1.01] active:scale-[0.98]',
              scrolled ? 'text-navy hover:bg-muted' : 'text-white hover:bg-white/10',
            )}
          >
            {open ? <CloseIcon size={26} /> : <HamburgerIcon size={26} />}
          </button>
        </div>
      </div>

      <nav aria-label="Menú móvil" className="md:hidden">
        {/* Backdrop Scrim — button for native kbd, solid bg (no blur) for GPU */}
        {open && (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={close}
            className="fixed inset-0 top-[68px] bg-black/30 z-40 md:hidden animate-fade-in"
          />
        )}

        {/* Floating Overlay Menu Panel — Radix FocusScope handles loop + SR announcement (inert keeps background hidden) */}
        <FocusScope.Root
          trapped={open}
          loop
          onMountAutoFocus={(e) => {
            e.preventDefault();
            firstLinkRef.current?.focus();
          }}
        >
          <div
            id="navMobile"
            ref={mobilePanelRef}
            inert={!open || undefined}
            className={cn(
              'absolute top-full left-0 right-0 z-50 bg-white border-b border-border/80 shadow-lg transition-all duration-200 ease-out',
              open
                ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                : 'opacity-0 -translate-y-2 pointer-events-none invisible',
            )}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a, button')) close();
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
                      'min-h-[44px] flex items-center text-base font-semibold py-3 px-3 rounded-xl transition-colors',
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
                Pedir mi crédito
              </ApplyButton>
            </div>
          </div>
        </FocusScope.Root>
      </nav>
    </header>
  );
}
