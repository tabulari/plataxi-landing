'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function PageLoader() {
  const [mounted, setMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const isotypeRef = useRef<SVGSVGElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setMounted(false);
      return;
    }

    // Lock body scroll during initial intro
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setMounted(false);
      },
    });

    const polygons = isotypeRef.current?.querySelectorAll('polygon');
    const wordmark = wordmarkRef.current;
    const bar = barRef.current;
    const percent = percentRef.current;
    const subtitle = subtitleRef.current;
    const container = containerRef.current;

    // Counter object for smooth number interpolation
    const progress = { val: 0 };

    // 1. Initial State
    gsap.set(polygons || [], { transformOrigin: 'center center', scale: 0, autoAlpha: 0 });
    gsap.set(wordmark, { autoAlpha: 0, y: 15, letterSpacing: '0.35em' });
    gsap.set(subtitle, { autoAlpha: 0, y: 10 });
    gsap.set(bar, { width: '0%' });

    // 2. Isotype Pieces Stagger In with Pop & Glow
    tl.to(
      polygons || [],
      {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.45,
        ease: 'back.out(1.8)',
      },
      0.1,
    );

    // 3. Wordmark & Subtitle Reveal
    tl.to(
      wordmark,
      {
        autoAlpha: 1,
        y: 0,
        letterSpacing: '0.18em',
        duration: 0.45,
        ease: 'power3.out',
      },
      0.3,
    );

    tl.to(
      subtitle,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
      },
      0.45,
    );

    // 4. Progress Counter & Bar Fill
    tl.to(
      bar,
      {
        width: '100%',
        duration: 0.65,
        ease: 'power2.inOut',
      },
      0.35,
    );

    tl.to(
      progress,
      {
        val: 100,
        duration: 0.65,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (percent) {
            percent.textContent = `${Math.round(progress.val)}%`;
          }
        },
      },
      0.35,
    );

    // 5. Final Flash Confirmation
    tl.to(
      isotypeRef.current,
      {
        scale: 1.08,
        filter: 'drop-shadow(0 0 35px rgba(255,221,0,0.85))',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      },
      1.0,
    );

    // 6. Luxury Curtain Exit (Slide Up)
    tl.to(
      container,
      {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut',
      },
      1.2,
    );
  }, { scope: containerRef });

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      id="plataxi-page-loader"
      className="fixed inset-0 z-[99999] bg-[#151515] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-[#ffdd00]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Plataxi Isotype */}
        <div className="relative mb-6">
          <svg
            ref={isotypeRef}
            width="88"
            height="50"
            viewBox="0 0 370 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,221,0,0.45))' }}
          >
            {/* Top Trapeze */}
            <polygon points="97,0 273,0 317,77 53,77" fill="#ffdd00" />
            {/* Left Wing */}
            <polygon points="0,96 52,96 112,200 60,200" fill="#ffdd00" />
            {/* Right Wing */}
            <polygon points="318,96 370,96 310,200 258,200" fill="#ffdd00" />
            {/* Bottom Trapeze */}
            <polygon points="76,96 294,96 234,200 136,200" fill="#ffdd00" />
          </svg>
        </div>

        {/* Wordmark */}
        <h1
          ref={wordmarkRef}
          className="text-2xl sm:text-3xl font-display font-black tracking-[0.18em] text-white"
        >
          PLATAXI
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xs font-semibold text-white/60 tracking-wider mt-2 uppercase"
        >
          Crédito digital para taxistas
        </p>

        {/* Progress Bar & Numeric Counter */}
        <div className="mt-7 w-52 sm:w-60 flex flex-col items-center gap-2.5">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
            <div
              ref={barRef}
              className="h-full bg-gradient-to-r from-[#ffdd00] to-[#fffbe0] rounded-full shadow-[0_0_12px_#ffdd00]"
            />
          </div>
          <span
            ref={percentRef}
            className="text-xs font-mono font-bold text-[#ffdd00] tracking-widest"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
