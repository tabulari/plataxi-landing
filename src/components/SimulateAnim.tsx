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
          once: true,
        },
      });
      if (header) tl.fromTo(header, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0);
      if (card) tl.fromTo(card, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0.08);
      return () => tl.kill();
    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="simula" tabIndex={-1} aria-labelledby="simula-heading" className="mt-8 sm:mt-12 lg:mt-14 scroll-mt-[96px]">
      {children}
    </section>
  );
}
