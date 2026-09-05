'use client';

import { useRef, useId, useEffect } from 'react';
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

// Catenary aerodynamic horizon curves with deep bottom anchors to prevent sub-pixel seams
const HORIZONS = {
  soft: {
    viewBox: '0 0 1440 50',
    d: 'M -100 0 C 360 30, 1080 30, 1540 0 V 100 H -100 Z',
    dSecondary: 'M -100 0 C 360 20, 1080 20, 1540 0 V 100 H -100 Z',
    dStroke: 'M -100 0 C 360 30, 1080 30, 1540 0',
  },
  medium: {
    viewBox: '0 0 1440 70',
    d: 'M -100 0 C 360 48, 1080 48, 1540 0 V 120 H -100 Z',
    dSecondary: 'M -100 0 C 360 32, 1080 32, 1540 0 V 120 H -100 Z',
    dStroke: 'M -100 0 C 360 48, 1080 48, 1540 0',
  },
  bold: {
    viewBox: '0 0 1440 90',
    d: 'M -100 0 C 360 68, 1080 68, 1540 0 V 140 H -100 Z',
    dSecondary: 'M -100 0 C 360 48, 1080 48, 1540 0 V 140 H -100 Z',
    dStroke: 'M -100 0 C 360 68, 1080 68, 1540 0',
  },
};

export function SectionDivider({
  from = 'var(--background)',
  to = 'var(--background)',
  waveColor,
  amplitude = 'medium',
  flip = false,
  className = '',
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const primaryPathRef = useRef<SVGPathElement>(null);
  const glowEdgeRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);

  const reactId = useId();
  const gradId = `viscoelastic-glow-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const { viewBox, d, dSecondary, dStroke } = HORIZONS[amplitude];

  const DARK_TOKEN = 'var(--color-primary-dark)';
  const CREAM_TOKEN = 'var(--color-secondary-surface)';
  const isDarkTo = to === DARK_TOKEN;
  const fillColor = waveColor || to;

  useGSAP(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let lastY = window.scrollY;
    let lastTime = performance.now();
    let inView = false;

    // IntersectionObserver guarantees we only compute physics when the divider is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0, rootMargin: '100px 0px 100px 0px' }
    );
    observer.observe(containerRef.current);

    const onScroll = () => {
      if (!inView) {
        lastY = window.scrollY;
        lastTime = performance.now();
        return;
      }

      const now = performance.now();
      const dt = Math.max(8, now - lastTime);
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      lastTime = now;

      // Normalised velocity: positive = scrolling down, negative = scrolling up
      const velocity = dy / dt;
      const clampedVelocity = Math.max(-1.8, Math.min(1.8, velocity));

      // Viscoelastic deformation factors
      const targetScaleY = 1 + clampedVelocity * 0.28;
      const targetTranslateY = clampedVelocity * 6;
      const gradientShift = clampedVelocity * 15;

      // 1. Kinetic deformation of the primary horizon
      if (primaryPathRef.current) {
        gsap.to(primaryPathRef.current, {
          scaleY: targetScaleY,
          y: targetTranslateY,
          duration: 0.12,
          ease: 'power1.out',
          overwrite: 'auto',
          onComplete: () => {
            // Spring return to perfect equilibrium with subtle damping bounce
            gsap.to(primaryPathRef.current, {
              scaleY: 1,
              y: 0,
              duration: 0.75,
              ease: 'elastic.out(1.15, 0.42)',
              overwrite: 'auto',
            });
          },
        });
      }

      // 2. Coordinated deformation of the luminous lens highlight
      if (glowEdgeRef.current) {
        gsap.to(glowEdgeRef.current, {
          scaleY: targetScaleY,
          y: targetTranslateY,
          duration: 0.12,
          ease: 'power1.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.to(glowEdgeRef.current, {
              scaleY: 1,
              y: 0,
              duration: 0.75,
              ease: 'elastic.out(1.15, 0.42)',
              overwrite: 'auto',
            });
          },
        });
      }

      // 3. Dynamic glint shift along the crest
      if (gradientRef.current) {
        gsap.to(gradientRef.current, {
          attr: { x1: `${20 - gradientShift}%`, x2: `${80 - gradientShift}%` },
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.to(gradientRef.current, {
              attr: { x1: '20%', x2: '80%' },
              duration: 0.8,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`block relative -mt-px -mb-px overflow-hidden pointer-events-none select-none z-10 ${className}`}
      aria-hidden="true"
      style={from ? { backgroundColor: from } : undefined}
    >
      <svg
        ref={svgRef}
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
        <defs>
          {/* Luminous micro-lens edge gradient */}
          <linearGradient
            ref={gradientRef}
            id={gradId}
            x1="20%"
            y1="0%"
            x2="80%"
            y2="0%"
          >
            <stop offset="0%" stopColor="var(--color-primary-brand)" stopOpacity="0" />
            <stop offset="35%" stopColor="var(--color-primary-brand)" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="65%" stopColor="var(--color-primary-brand)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-primary-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Secondary Harmonic Stratum */}
        <path
          d={dSecondary}
          fill={isDarkTo ? CREAM_TOKEN : fillColor}
          opacity={isDarkTo ? '0.55' : waveColor ? '0.55' : '0.35'}
        />

        {/* Primary Viscoelastic Horizon Surface */}
        <path
          ref={primaryPathRef}
          d={d}
          fill={isDarkTo ? DARK_TOKEN : fillColor}
          style={{ transformOrigin: '50% 100%' }}
        />

        {/* Luminous Precision Rim */}
        <path
          ref={glowEdgeRef}
          d={dStroke}
          stroke={`url(#${gradId})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          style={{ transformOrigin: '50% 100%' }}
        />
      </svg>
    </div>
  );
}
