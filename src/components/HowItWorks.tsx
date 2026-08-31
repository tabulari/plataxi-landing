'use client';

import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  CheckCircleIcon,
  SparklesIcon,
  BoltIcon,
} from './icons';
import { ApplyButton } from './ApplyButton';

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const trackFillRef = useRef<HTMLDivElement>(null);
  const pulseOrbRef = useRef<HTMLDivElement>(null);
  const mobileTrackFillRef = useRef<HTMLDivElement>(null);
  const mobilePulseOrbRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const eyebrow = containerRef.current?.querySelector('[data-hiw="eyebrow"]');
    const heading = containerRef.current?.querySelector('[data-hiw="heading"]');
    const subtitle = containerRef.current?.querySelector('[data-hiw="subtitle"]');
    const cards = containerRef.current?.querySelectorAll('[data-hiw="step"]');
    const badges = containerRef.current?.querySelectorAll('[data-hiw="badge"]');
    const cta = containerRef.current?.querySelector('[data-hiw="cta"]');
    const trackFill = trackFillRef.current;
    const pulseOrb = pulseOrbRef.current;
    const mobileTrackFill = mobileTrackFillRef.current;
    const mobilePulseOrb = mobilePulseOrbRef.current;

    // Master Scroll-Linked 3D Perspective Floating Wave Journey
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 70%',
        scrub: 0.8,
      },
    });

    // 01: Header reveal
    if (eyebrow) tl.fromTo(eyebrow, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15 }, 0);
    if (heading) tl.fromTo(heading, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2 }, 0.05);
    if (subtitle) tl.fromTo(subtitle, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15 }, 0.1);

    // Initial baseline state for all 3 monolithic cards
    if (cards && cards.length) {
      tl.fromTo(
        cards,
        { y: 35, autoAlpha: 1, scale: 0.96 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.06 },
        0.1,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 1: CARD 01 FLOATS FORWARD IN 3D SPACE (15% - 40% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (cards && cards[0]) {
      tl.to(
        cards[0],
        {
          y: -12,
          scale: 1.03,
          rotateX: -2,
          autoAlpha: 1,
          borderColor: '#f5e15b',
          boxShadow: '0 24px 48px -10px rgba(245,225,91,0.20)',
          duration: 0.25,
          ease: 'power2.out',
        },
        0.18,
      );
    }
    if (badges && badges[0]) {
      tl.to(badges[0], { scale: 1.1, backgroundColor: '#f5e15b', color: '#111110', borderColor: '#f5e15b', duration: 0.15 }, 0.2);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 2: RELAY 01 ➔ 02: Energy Orb travels along pipeline (40% - 68% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (cards && cards[0]) {
      tl.to(
        cards[0],
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          borderColor: 'rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          duration: 0.2,
        },
        0.4,
      );
    }
    if (badges && badges[0]) {
      tl.to(badges[0], { scale: 1, duration: 0.15 }, 0.4);
    }

    if (trackFill) tl.fromTo(trackFill, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 0.5, duration: 0.28, ease: 'none' }, 0.38);
    if (mobileTrackFill) tl.fromTo(mobileTrackFill, { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 0.5, duration: 0.28, ease: 'none' }, 0.38);
    if (pulseOrb) tl.fromTo(pulseOrb, { left: '0%', autoAlpha: 0 }, { left: '50%', autoAlpha: 1, duration: 0.28, ease: 'power1.inOut' }, 0.38);
    if (mobilePulseOrb) tl.fromTo(mobilePulseOrb, { top: '0%', autoAlpha: 0 }, { top: '50%', autoAlpha: 1, duration: 0.28, ease: 'power1.inOut' }, 0.38);

    if (cards && cards[1]) {
      tl.to(
        cards[1],
        {
          y: -12,
          scale: 1.03,
          rotateX: -2,
          autoAlpha: 1,
          borderColor: '#f5e15b',
          boxShadow: '0 24px 48px -10px rgba(245,225,91,0.20)',
          duration: 0.25,
          ease: 'power2.out',
        },
        0.48,
      );
    }
    if (badges && badges[1]) {
      tl.to(badges[1], { scale: 1.1, backgroundColor: '#f5e15b', color: '#111110', borderColor: '#f5e15b', duration: 0.15 }, 0.5);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 3: RELAY 02 ➔ 03: Energy Orb arrives at Hero Step 03 (68% - 92% scroll)
    // ─────────────────────────────────────────────────────────────────────────
    if (cards && cards[1]) {
      tl.to(
        cards[1],
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          borderColor: 'rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          duration: 0.2,
        },
        0.68,
      );
    }
    if (badges && badges[1]) {
      tl.to(badges[1], { scale: 1, duration: 0.15 }, 0.68);
    }

    if (trackFill) tl.to(trackFill, { scaleX: 1, duration: 0.28, ease: 'none' }, 0.68);
    if (mobileTrackFill) tl.to(mobileTrackFill, { scaleY: 1, duration: 0.28, ease: 'none' }, 0.68);
    if (pulseOrb) tl.to(pulseOrb, { left: '100%', duration: 0.28, ease: 'power1.inOut' }, 0.68);
    if (mobilePulseOrb) tl.to(mobilePulseOrb, { top: '100%', duration: 0.28, ease: 'power1.inOut' }, 0.68);

    if (cards && cards[2]) {
      tl.to(
        cards[2],
        {
          y: -14,
          scale: 1.04,
          rotateX: -2,
          autoAlpha: 1,
          borderColor: '#f5e15b',
          boxShadow: '0 28px 55px -10px rgba(245,225,91,0.25)',
          duration: 0.25,
          ease: 'power2.out',
        },
        0.75,
      );
    }
    if (badges && badges[2]) {
      tl.to(badges[2], { scale: 1.15, backgroundColor: '#f5e15b', color: '#111110', borderColor: '#f5e15b', duration: 0.15 }, 0.78);
    }

    // 04: CTA Reveal
    if (cta) {
      tl.fromTo(cta, { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.15 }, 0.88);
    }
  }, { scope: containerRef });

  // Pure GSAP 60fps 3D Floating & Magnetic Cursor Tilt
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const card = e.currentTarget;
    gsap.to(card, {
      y: -10,
      scale: 1.02,
      borderColor: '#f5e15b',
      boxShadow: '0 25px 50px -12px rgba(13, 42, 94, 0.14)',
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      duration: 0.15,
      ease: 'power1.out',
    });
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      borderColor: 'rgba(226, 232, 240, 0.9)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      duration: 0.45,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="como-funciona"
      aria-labelledby="hiw-heading"
      className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden"
    >
      <div className="mx-auto max-w-container px-6">
        {/* Section Header: Seamless Scale & Hierarchy */}
        <div className="mb-10 lg:mb-12 text-center max-w-2xl mx-auto space-y-2">
          <p
            data-hiw="eyebrow"
            className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-1.5"
          >
            Cómo funciona
          </p>
          <h2
            data-hiw="heading"
            id="hiw-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-tight text-navy"
          >
            Tu crédito en 3 simples pasos
          </h2>
          <p
            data-hiw="subtitle"
            className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed"
          >
            Un proceso transparente, 100% en línea y sin intermediarios.
          </p>
        </div>

        {/* 3-Step Floating Wave Connected Matrix */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Connecting Line & Traveling Orb */}
          <div
            className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-[3px] bg-border/80 rounded-full z-0 overflow-visible"
            aria-hidden="true"
          >
            <div
              ref={trackFillRef}
              className="h-full w-full bg-gradient-to-r from-green/50 via-green to-green rounded-full"
            />
            <div
              ref={pulseOrbRef}
              className="absolute -top-[5.5px] w-3.5 h-3.5 -ml-[7px] rounded-full bg-green border-2 border-white shadow-[0_0_14px_#f5e15b] z-20 will-change-transform"
            />
          </div>

          {/* Mobile Connecting Line & Traveling Orb */}
          <div
            className="block md:hidden absolute left-[36px] top-[48px] bottom-[48px] w-[3px] bg-border/80 rounded-full z-0 overflow-visible"
            aria-hidden="true"
          >
            <div
              ref={mobileTrackFillRef}
              className="w-full h-full bg-gradient-to-b from-green/50 via-green to-green rounded-full"
            />
            <div
              ref={mobilePulseOrbRef}
              className="absolute -left-[5.5px] w-3.5 h-3.5 -mt-[7px] rounded-full bg-green border-2 border-white shadow-[0_0_14px_#f5e15b] z-20 will-change-transform"
            />
          </div>

          {/* Cards Grid: Footerless Monolithic Floating Containers */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 1: Diligencia tu solicitud                              */}
            {/* ───────────────────────────────────────────────────────────── */}
            <li
              data-hiw="step"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative rounded-3xl bg-white p-7 sm:p-8 shadow-xs border-2 border-border/80 flex flex-col justify-between h-full min-h-[290px] transform-gpu will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header: Number & Tag */}
              <div className="flex items-center justify-between w-full mb-6">
                <span
                  data-hiw="badge"
                  className="flex items-center justify-center w-11 h-11 rounded-2xl bg-green-tint text-green-ink border border-green/30 font-bold text-sm shrink-0 tabular-nums shadow-2xs transition-all duration-300 z-10"
                >
                  <span className="sr-only">Paso </span>01
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-ink bg-green-soft px-3 py-1.5 rounded-full border border-green/20">
                  <CheckCircleIcon size={14} className="text-green-ink" />
                  Requisitos mínimos
                </span>
              </div>

              {/* Body: Pure Institutional Typography (No Footer) */}
              <div className="space-y-2.5 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-navy group-hover:text-green-ink transition-colors tracking-tight">
                  Diligencia tu solicitud
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Ingresa tus datos personales y número de cédula en el formulario seguro. Todo 100% digital en menos de 3 minutos.
                </p>
              </div>
            </li>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 2: Recibe tu cotización                                 */}
            {/* ───────────────────────────────────────────────────────────── */}
            <li
              data-hiw="step"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative rounded-3xl bg-white p-7 sm:p-8 shadow-xs border-2 border-border/80 flex flex-col justify-between h-full min-h-[290px] transform-gpu will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header: Number & Tag */}
              <div className="flex items-center justify-between w-full mb-6">
                <span
                  data-hiw="badge"
                  className="flex items-center justify-center w-11 h-11 rounded-2xl bg-green-tint text-green-ink border border-green/30 font-bold text-sm shrink-0 tabular-nums shadow-2xs transition-all duration-300 z-10"
                >
                  <span className="sr-only">Paso </span>02
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-ink bg-green-soft px-3 py-1.5 rounded-full border border-green/20">
                  <BoltIcon size={14} className="text-green-ink" />
                  Estudio digital
                </span>
              </div>

              {/* Body: Pure Institutional Typography (No Footer) */}
              <div className="space-y-2.5 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-navy group-hover:text-green-ink transition-colors tracking-tight">
                  Recibe tu cotización
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Evaluamos tu solicitud de forma automática y te presentamos la tasa fija, plazo y valor exacto de tus cuotas.
                </p>
              </div>
            </li>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* STEP 3: Recibe tu dinero                                      */}
            {/* ───────────────────────────────────────────────────────────── */}
            <li
              data-hiw="step"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="group relative rounded-3xl bg-white p-7 sm:p-8 shadow-xs border-2 border-border/80 flex flex-col justify-between h-full min-h-[290px] transform-gpu will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header: Number & Tag */}
              <div className="flex items-center justify-between w-full mb-6">
                <span
                  data-hiw="badge"
                  className="flex items-center justify-center w-11 h-11 rounded-2xl bg-green-tint text-green-ink border border-green/30 font-bold text-sm shrink-0 tabular-nums shadow-2xs transition-all duration-300 z-10"
                >
                  <span className="sr-only">Paso </span>03
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-ink bg-green-soft px-3 py-1.5 rounded-full border border-green/20">
                  <SparklesIcon size={14} className="text-green-ink" />
                  Desembolso directo
                </span>
              </div>

              {/* Body: Pure Institutional Typography (No Footer) */}
              <div className="space-y-2.5 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-navy group-hover:text-green-ink transition-colors tracking-tight">
                  Recibe tu dinero
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Aceptas la oferta en línea y transferimos los fondos directamente a tu cuenta bancaria, Nequi o DaviPlata.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Primary Action CTA */}
        <div data-hiw="cta" className="mt-10 lg:mt-12 text-center">
          <ApplyButton origin="hiw" size="lg" className="min-h-[48px] px-8 shadow-sm">
            Solicitar crédito
          </ApplyButton>
        </div>
      </div>
    </section>
  );
}
