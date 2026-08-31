'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface SectionDividerProps {
  from?: string;
  to?: string;
  waveColor?: string;
  amplitude?: 'soft' | 'medium' | 'bold';
  flip?: boolean;
  className?: string;
}

// Oversized paths starting at -200 and extending to 1640 with deep bottom anchor (V140)
// Guarantees zero side gaps and zero sub-pixel seam glitches across all screen sizes and zoom levels.
const WAVES = {
  soft: {
    viewBox: '0 0 1440 40',
    d: 'M-200 120V24C160 14 460 14 720 24C980 34 1280 34 1640 24V120H-200Z',
    dSecondary: 'M-200 120V28C220 18 520 20 840 28C1100 34 1360 30 1640 26V120H-200Z',
  },
  medium: {
    viewBox: '0 0 1440 60',
    d: 'M-200 140V30C160 8 460 8 720 30C980 52 1280 52 1640 30V140H-200Z',
    dSecondary: 'M-200 140V38C220 16 520 12 840 36C1100 50 1360 44 1640 34V140H-200Z',
  },
  bold: {
    viewBox: '0 0 1440 80',
    d: 'M-200 160V42C160 18 460 18 720 40C980 62 1280 62 1640 38V160H-200Z',
    dSecondary: 'M-200 160V50C220 28 520 26 840 48C1100 66 1360 62 1640 44V160H-200Z',
  },
};

export function SectionDivider({
  from = '#ffffff',
  to = '#ffffff',
  waveColor,
  amplitude = 'medium',
  flip = false,
  className = '',
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryWaveRef = useRef<SVGPathElement>(null);
  const secondaryWaveRef = useRef<SVGPathElement>(null);
  const { viewBox, d, dSecondary } = WAVES[amplitude];

  const isDarkTo = to === '#111110' || to === '#151515' || to === '#0a0a0a' || to?.includes('111110') || to?.includes('151515') || to?.includes('0a0a0a');
  const fillColor = waveColor || to;

  useGSAP(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || reduceMotion || !containerRef.current) return;

    const primary = primaryWaveRef.current;
    const secondary = secondaryWaveRef.current;

    // Butter-smooth, calming harmonic fluid sine oscillations on desktop
    if (primary) {
      gsap.to(primary, {
        x: flip ? -20 : 20,
        scaleY: 1.05,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 100%',
      });
    }

    if (secondary) {
      gsap.to(secondary, {
        x: flip ? 28 : -28,
        scaleY: 1.08,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
        transformOrigin: '50% 100%',
      });
    }
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`block relative -mt-px -mb-px overflow-hidden pointer-events-none select-none z-10 ${className}`}
      aria-hidden="true"
      style={from ? { backgroundColor: from } : undefined}
    >
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block transform-gpu will-change-transform"
        preserveAspectRatio="none"
        style={{
          marginBottom: '-2px',
          ...(flip ? { transform: 'scaleX(-1)' } : {}),
        }}
      >
        {/* Harmonic Translucent Undertone Wave */}
        <path
          ref={secondaryWaveRef}
          d={dSecondary}
          fill={isDarkTo ? '#fffbe0' : fillColor}
          opacity={isDarkTo ? '0.6' : waveColor ? '0.6' : '0.35'}
        />
        {/* Primary Solid Surface Wave */}
        <path
          ref={primaryWaveRef}
          d={d}
          fill={isDarkTo ? to : fillColor}
        />
      </svg>
    </div>
  );
}
