'use client';

import { useRef, useId } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const secondaryPathRef = useRef<SVGPathElement>(null);
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

    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    // High-performance quickTo setters for 120 FPS continuous tracking without GC pressure
    const quickPrimaryScaleY = primaryPathRef.current
      ? gsap.quickTo(primaryPathRef.current, 'scaleY', { duration: 0.22, ease: 'power2.out' })
      : null;
    const quickPrimaryY = primaryPathRef.current
      ? gsap.quickTo(primaryPathRef.current, 'y', { duration: 0.22, ease: 'power2.out' })
      : null;

    const quickSecondaryScaleY = secondaryPathRef.current
      ? gsap.quickTo(secondaryPathRef.current, 'scaleY', { duration: 0.32, ease: 'power2.out' })
      : null;
    const quickSecondaryY = secondaryPathRef.current
      ? gsap.quickTo(secondaryPathRef.current, 'y', { duration: 0.32, ease: 'power2.out' })
      : null;

    const quickGlowScaleY = glowEdgeRef.current
      ? gsap.quickTo(glowEdgeRef.current, 'scaleY', { duration: 0.22, ease: 'power2.out' })
      : null;
    const quickGlowY = glowEdgeRef.current
      ? gsap.quickTo(glowEdgeRef.current, 'y', { duration: 0.22, ease: 'power2.out' })
      : null;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        // Normalised velocity from ScrollTrigger (pixels/second -> normalised units)
        const velocity = (self.getVelocity() || 0) / 1000;
        const clampedVelocity = Math.max(-1.8, Math.min(1.8, velocity));

        // Viscoelastic deformation factors
        const targetScaleY = 1 + clampedVelocity * 0.25;
        const targetTranslateY = clampedVelocity * 5;
        const secondaryScaleY = 1 + clampedVelocity * 0.18;
        const secondaryTranslateY = clampedVelocity * 3.5;

        // Real-time kinematic tracking (smooth, zero-allocation)
        if (quickPrimaryScaleY && quickPrimaryY) {
          quickPrimaryScaleY(targetScaleY);
          quickPrimaryY(targetTranslateY);
        }
        if (quickSecondaryScaleY && quickSecondaryY) {
          quickSecondaryScaleY(secondaryScaleY);
          quickSecondaryY(secondaryTranslateY);
        }
        if (quickGlowScaleY && quickGlowY) {
          quickGlowScaleY(targetScaleY);
          quickGlowY(targetTranslateY);
        }

        // Dynamic glint shift along the crest
        if (gradientRef.current) {
          const shift = clampedVelocity * 12;
          gradientRef.current.setAttribute('x1', `${20 - shift}%`);
          gradientRef.current.setAttribute('x2', `${80 - shift}%`);
        }

        // Clear any pending spring return while active scrolling is happening
        if (resetTimer) clearTimeout(resetTimer);

        // Spring return to perfect equilibrium with Emil's signature damped bounce
        resetTimer = setTimeout(() => {
          const elementsToSpring = [primaryPathRef.current, glowEdgeRef.current].filter(Boolean);
          if (elementsToSpring.length) {
            gsap.to(elementsToSpring, {
              scaleY: 1,
              y: 0,
              duration: 0.85,
              ease: 'elastic.out(1.15, 0.42)',
              overwrite: 'auto',
            });
          }
          if (secondaryPathRef.current) {
            gsap.to(secondaryPathRef.current, {
              scaleY: 1,
              y: 0,
              duration: 0.95,
              ease: 'elastic.out(1.1, 0.45)',
              overwrite: 'auto',
            });
          }
          if (gradientRef.current) {
            gsap.to(gradientRef.current, {
              attr: { x1: '20%', x2: '80%' },
              duration: 0.7,
              ease: 'power3.out',
            });
          }
        }, 90);
      },
    });

    return () => {
      trigger.kill();
      if (resetTimer) clearTimeout(resetTimer);
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
        className="w-full h-12 sm:h-16 lg:h-20 block transform-gpu will-change-transform overflow-hidden"
        preserveAspectRatio="none"
        style={{
          marginBottom: '-2px',
          overflow: 'hidden',
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

        {/* Secondary Harmonic Stratum — Deforms concurrently with subtle fluid lag */}
        <path
          ref={secondaryPathRef}
          d={dSecondary}
          fill={isDarkTo ? CREAM_TOKEN : fillColor}
          opacity={isDarkTo ? '0.55' : waveColor ? '0.55' : '0.35'}
          style={{ transformOrigin: '50% 100%' }}
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
