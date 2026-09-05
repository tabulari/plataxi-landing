'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function HeroAnim({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = containerRef.current?.querySelectorAll<HTMLElement>('[data-hero-anim]');
        if (!items?.length) return;
        const tween = gsap.fromTo(
          items,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out', delay: 0.1 },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return <div ref={containerRef} className="contents">{children}</div>;
}
