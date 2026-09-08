'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import * as FocusScope from '@radix-ui/react-focus-scope';
import { cn } from '@/lib/utils';
import { config } from '@/lib/config';
import { CloseIcon, HamburgerIcon, PlataxiWordmark } from './icons';
import { ScrollButton } from './ScrollButton';
import { ApplyButton } from './ApplyButton';
import { useActiveSubmission } from '@/hooks/use-active-submission';

const HEADER_OFFSET = 80;

const LINKS = [
  { href: '#simula', label: 'Simular cuota' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#preguntas', label: 'Preguntas' },
];

const SECTION_IDS = LINKS.map((l) => l.href.slice(1));
const MOBILE_LINKS = LINKS.filter((l) => l.href !== '#simula');

export function Nav() {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!isLanding);
  const [activeId, setActiveId] = useState('');
  const activeSubmission = useActiveSubmission();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    const el = document.querySelector(href) as HTMLElement | null;
    if (el) {
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', href);
      // 12. Mueve foco a la sección destino para lectores de pantalla (no al toggle)
      setOpen(false);
      // deja que el scroll inicie, luego enfoca la sección
      requestAnimationFrame(() => {
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      });
      return;
    }
    close();
  }, [close]);

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
    // 7. Lock completo: body + html (iOS Safari scrollea html aunque body esté hidden)
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPaddingRight = document.body.style.paddingRight;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    }
    // iOS: previene scroll por touchmove fuera del panel
    const onTouchMove = (e: TouchEvent) => {
      const panel = mobilePanelRef.current;
      if (panel && panel.contains(e.target as Node)) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPaddingRight;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.paddingRight = '';
      document.removeEventListener('touchmove', onTouchMove);
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

  // 4. Anti-FOUC: sync antes de paint si ya hay scroll (useLayoutEffect, no useEffect)
  useLayoutEffect(() => {
    if (!isLanding) {
      setScrolled(true);
      return;
    }
    if (window.scrollY > 10) {
      setScrolled(true);
      return;
    }
    const heroSync = document.querySelector('section[aria-labelledby="hero-heading"]') as HTMLElement | null;
    if (heroSync && heroSync.getBoundingClientRect().bottom < 68) {
      setScrolled(true);
    }
  }, [isLanding]);

  useEffect(() => {
    if (!isLanding) {
      return;
    }
    const setup = (heroEl: HTMLElement) => {
      // 5. Observa hero + secciones, y si secciones aún no existen las descubre vía MutationObserver
      const getSections = () =>
        SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

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
          // 9. Fallback robusto: elige la sección visible más cercana al header, no la primera
          const sections = getSections();
          const candidates = sections
            .map((s) => ({ s, r: s.getBoundingClientRect() }))
            .filter(({ r }) => r.top < window.innerHeight * 0.6 && r.bottom > 68);
          if (candidates.length === 0) {
            setActiveId('');
            return;
          }
          candidates.sort((a, b) => Math.abs(a.r.top - 68) - Math.abs(b.r.top - 68));
          setActiveId(candidates[0].s.id);
        },
        { rootMargin: '-68px 0px -50% 0px', threshold: 0 },
      );
      const observeSections = () => getSections().forEach((s) => sectionIO.observe(s));
      observeSections();

      // 5. Descubre secciones que se montan tarde (RSC/CSR race)
      const sectionsMO = new MutationObserver(() => {
        const fresh = getSections();
        fresh.forEach((s) => sectionIO.observe(s));
      });
      sectionsMO.observe(document.body, { childList: true, subtree: true });

      return () => {
        heroIO.disconnect();
        sectionIO.disconnect();
        sectionsMO.disconnect();
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
  }, [isLanding]);

    // True when menu/header should be styled in dark theme (over hero at top of page)
    const isDark = !scrolled;

    return (
      <>
        <a href="#simula" className="skip-link">
          Saltar al simulador
        </a>
        <header
          id="top"
          className={cn(
            'fixed top-0 left-0 right-0 z-50 motion-safe:transition-colors motion-safe:duration-300',
          open
            ? isDark
              ? 'bg-primary-dark border-b border-white/10'
              : 'bg-background border-b border-border/60'
            : scrolled
            ? 'bg-background border-b border-border/60 shadow-none'
            : 'bg-transparent border-b border-transparent shadow-none',
        )}
      >
        {/* Legibility scrim for the transparent state. */}
        {!scrolled && !open && (
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
            <span
              aria-hidden="true"
              role="presentation"
              className={cn('motion-safe:transition-opacity motion-safe:duration-300', isDark ? 'opacity-100' : 'opacity-0')}
            >
              <PlataxiWordmark height={28} variant="white" />
            </span>
            <span
              aria-hidden="true"
              role="presentation"
              className={cn('motion-safe:transition-opacity motion-safe:duration-300', isDark ? 'opacity-0' : 'opacity-100')}
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
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => handleNavClick(e, l.href)}
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
            {activeSubmission && (
              <ApplyButton
                origin="nav"
                variant="ghost"
                className={cn(
                  'min-h-[36px] h-9 px-3.5 rounded-full inline-flex items-center gap-2 text-xs font-bold border transition-colors shadow-xs cursor-pointer focus-visible:ring-1 focus-visible:ring-green',
                  scrolled
                    ? 'bg-green/10 border-green/30 text-navy hover:bg-green/20'
                    : 'bg-white/15 border-white/25 text-white hover:bg-white/25',
                )}
              >
                <span className="w-2 h-2 rounded-full bg-green animate-pulse" aria-hidden="true" />
                <span>Mi Solicitud ({activeSubmission.radicado})</span>
              </ApplyButton>
            )}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="navMobile"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              'md:hidden flex items-center justify-center w-11 h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-transform hover:scale-[1.01] active:scale-[0.98]',
              isDark ? 'text-white hover:bg-white/10' : 'text-navy hover:bg-muted',
            )}
          >
            {open ? <CloseIcon size={26} /> : <HamburgerIcon size={26} />}
          </button>
        </div>

        <nav aria-label="Menú móvil" className="md:hidden">
          {/* Backdrop Scrim — div no button, fuera del trap no debe ser focuseable */}
          {open && (
            <div
              aria-hidden="true"
              onClick={close}
              className="fixed inset-0 top-[68px] bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
            />
          )}

          {/* Floating Overlay Menu Panel */}
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
              // inert no soportado en Safari <17.4 / Firefox → fallback con aria-hidden + tabIndex -1 en links
              {...(!open ? { inert: '' } as unknown as React.HTMLAttributes<HTMLDivElement> : {})}
              aria-hidden={!open || undefined}
              className={cn(
                'absolute top-full left-0 right-0 z-50 border-b shadow-2xl motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
                isDark
                  ? 'bg-primary-dark border-white/10 text-white'
                  : 'bg-white border-border/80 text-navy',
                open
                  ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                  : 'opacity-0 -translate-y-2 pointer-events-none invisible',
              )}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a, button')) close();
              }}
            >
              <div className="px-6 py-5 flex flex-col gap-2">
                {activeSubmission && (
                  <div className="pb-2 border-b border-white/10">
                    <ApplyButton
                      origin="nav"
                      variant="ghost"
                      onClick={close}
                      tabIndex={open ? 0 : -1}
                      className={cn(
                        'w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl text-xs font-semibold border text-left cursor-pointer focus-visible:ring-1 focus-visible:ring-green',
                        isDark
                          ? 'bg-white/10 border-white/15 text-white'
                          : 'bg-green/10 border-green/30 text-navy',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green animate-pulse" aria-hidden="true" />
                        <span>Tu solicitud: <b className="font-bold tabular-nums">{activeSubmission.radicado}</b></span>
                      </span>
                      <span className="text-xs font-bold underline underline-offset-2 shrink-0">Ver estado →</span>
                    </ApplyButton>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {MOBILE_LINKS.map((l, i) => {
                    const isActive = activeId === l.href.slice(1);
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        ref={i === 0 ? firstLinkRef : undefined}
                        aria-current={isActive ? "page" : undefined}
                        tabIndex={open ? 0 : -1}
                        onClick={(e) => handleNavClick(e, l.href)}
                        className={cn(
                          'min-h-[44px] flex items-center text-base font-semibold py-3 px-3.5 rounded-xl transition-colors',
                          isDark
                            ? isActive
                              ? 'text-primary-brand bg-primary-brand/15 font-bold'
                              : 'text-white/85 hover:text-white hover:bg-white/5'
                            : isActive
                              ? 'text-navy bg-green/25 font-bold'
                              : 'text-muted-2 hover:text-navy hover:bg-black/5',
                        )}
                      >
                        {l.label}
                      </a>
                    );
                  })}
                </div>

                {/* Mobile Menu Action Area */}
                <div
                  className={cn(
                    'pt-4 mt-1 border-t flex flex-col gap-2.5',
                    isDark ? 'border-white/10' : 'border-border/60',
                  )}
                >
                  <ScrollButton
                    variant="default"
                    size="lg"
                    target="#simula"
                    tabIndex={open ? 0 : -1}
                    onClick={close}
                    className="w-full min-h-[48px] rounded-xl font-bold bg-primary-brand text-primary-dark hover:bg-primary-brand/90 transition-all active:scale-[0.98] shadow-md justify-center text-sm"
                  >
                    Simular mi cuota
                  </ScrollButton>
                </div>
              </div>
            </div>
          </FocusScope.Root>
        </nav>
      </header>
      </>
  );
}
