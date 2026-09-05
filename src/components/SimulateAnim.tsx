'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function SimulateAnim({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const header = containerRef.current?.querySelector<HTMLElement>('[data-sim="header"]');
      const card = containerRef.current?.querySelector<HTMLElement>('[data-sim="card"]');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play reverse play reverse',
        },
      });
      if (header) tl.fromTo(header, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0);
      if (card) tl.fromTo(card, { y: 32, scale: 0.98, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.65, ease: 'power3.out' }, 0.15);
      return () => tl.kill();
    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="simula" tabIndex={-1} aria-labelledby="simula-heading" className="mt-16 md:mt-32 scroll-mt-[96px]">
      {children}
    </section>
  );
}
