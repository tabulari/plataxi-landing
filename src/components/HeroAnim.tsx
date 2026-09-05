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
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return <div ref={containerRef} className="contents">{children}</div>;
}
