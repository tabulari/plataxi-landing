'use client';

import { useEffect, useState } from 'react';
import { fmtCOP } from '@/lib/credit';
import { useSimulator } from './simulator-store';
import { ScrollButton } from './ScrollButton';
import { ApplyButton } from './ApplyButton';
import { cn } from '@/lib/utils';
import { PencilIcon } from './icons';

export function StickyPaymentBar() {
  const { sim } = useSimulator();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const heroCtas = document.querySelector('[data-slot="hero-ctas"]');
    const simCard = document.getElementById('simulator');
    const footer = document.querySelector('[data-slot="footer"]');

    const supportsIO = typeof IntersectionObserver !== 'undefined';

    if (!supportsIO) {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const heroBottom = heroCtas
            ? heroCtas.getBoundingClientRect().bottom
            : -1;
          const pastHero = heroCtas
            ? heroBottom < 0
            : window.scrollY > 240;
          const simRect = simCard?.getBoundingClientRect();
          const simVisible = simRect
            ? simRect.top < window.innerHeight * 0.75 &&
              simRect.bottom > 0
            : false;
          const footerRect = footer?.getBoundingClientRect();
          const atFooter = footerRect
            ? footerRect.top < window.innerHeight
            : false;
          setShow(pastHero && !simVisible && !atFooter);
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }

    let pastHero = false;
    let simVisible = false;
    let atFooter = false;
    const update = () =>
      setShow(pastHero && !simVisible && !atFooter);

    const observers: IntersectionObserver[] = [];
    if (heroCtas) {
      const o = new IntersectionObserver(
        ([en]) => {
          pastHero =
            !en.isIntersecting && en.boundingClientRect.top < 0;
          update();
        },
        { threshold: 0 },
      );
      o.observe(heroCtas);
      observers.push(o);
    }
    if (simCard) {
      const o = new IntersectionObserver(
        ([en]) => {
          simVisible = en.isIntersecting;
          update();
        },
        { threshold: 0.25 },
      );
      o.observe(simCard);
      observers.push(o);
    }
    if (footer) {
      const o = new IntersectionObserver(
        ([en]) => {
          atFooter = en.isIntersecting;
          update();
        },
        { threshold: 0 },
      );
      o.observe(footer);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.classList.toggle('has-payment-bar', show);
    return () => document.body.classList.remove('has-payment-bar');
  }, [show]);

  return (
    <div
      data-slot="payment-bar"
      role="region"
      aria-label="Resumen de simulación"
      className={cn(
        'md:hidden fixed inset-x-0 bottom-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(13,42,94,0.08)]',
        'px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out motion-reduce:transition-none',
        show ? 'translate-y-0' : 'translate-y-[130%]',
      )}
      inert={!show || undefined}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Tu cuota estimada: $${fmtCOP(sim.payment)} ${sim.unit}. Monto: $${fmtCOP(sim.amount)}, plazo: ${sim.term} meses.`}
      </div>
      <div className="flex items-center gap-4 w-full max-w-[var(--maxw,1120px)]">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 shrink-0 min-w-0">
          <span className="text-xs font-semibold text-muted-2 uppercase tracking-wide sm:normal-case sm:tracking-normal">
            Tu cuota estimada
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-navy whitespace-nowrap tracking-tight tabular-nums">
            {`$${fmtCOP(sim.payment)}`}
            <span className="text-xs font-semibold text-muted-2 ml-1">{sim.unit}</span>
          </span>
        </div>
        <span className="hidden sm:block text-sm font-semibold text-muted-2 pl-4 border-l border-border whitespace-nowrap">
          {`$${fmtCOP(sim.amount)} · ${sim.term} meses`}
        </span>
        <div className="flex items-center gap-3 ml-auto shrink-0 min-h-[44px]">
          <ScrollButton
            variant="ghost"
            size="sm"
            target="#simula"
            aria-label="Ajustar tu simulación"
            className="text-navy h-11"
          >
            <PencilIcon size={17} />
            <span className="hidden sm:inline">Ajustar</span>
          </ScrollButton>
          <ApplyButton
            origin="simulator"
            variant="default"
            size="sm"
            disabled={!sim.valid}
            className="h-11"
          >
            Solicitar crédito
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}
