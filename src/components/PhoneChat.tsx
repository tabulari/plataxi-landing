'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '@/lib/config';
import { calculatePayment, fmtCOP } from '@/lib/credit';
import { useSiteUi } from './site-ui';
import { useSimulator } from './simulator-store';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';
import './phone-chat.css';

const phoneSim = calculatePayment(
  config.simulator.defaultAmount,
  config.simulator.defaultTerm,
  'monthly',
);

function startMouseTilt(
  shell: HTMLElement,
  wrapper: HTMLElement,
): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 980px)').matches;
  if (reduceMotion || !isDesktop) return () => {};

  gsap.set(shell, { x: 0, y: 0, rotateX: 0, rotateY: 0, transformPerspective: 1200, transformOrigin: 'center center' });

  const PROXIMITY = 140;
  const MAX_ROT_Y = 4;
  const MAX_ROT_X = 3;
  const clampY = gsap.utils.clamp(-MAX_ROT_Y, MAX_ROT_Y);
  const clampX = gsap.utils.clamp(-MAX_ROT_X, MAX_ROT_X);
  let wasInZone = false;

  const applyTilt = (rotY: number, rotX: number) => {
    gsap.to(shell, { rotateY: rotY, rotateX: rotX, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
  };

  const onMove = (e: MouseEvent) => {
    const rect = wrapper.getBoundingClientRect();
    const inZone =
      e.clientX >= rect.left - PROXIMITY &&
      e.clientX <= rect.right + PROXIMITY &&
      e.clientY >= rect.top - PROXIMITY &&
      e.clientY <= rect.bottom + PROXIMITY;

    if (!inZone) {
      if (wasInZone) {
        applyTilt(0, 0);
        wasInZone = false;
      }
      return;
    }

    wasInZone = true;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    applyTilt(clampY(x * 4), clampX(-y * 3));
  };

  const onLeave = () => {
    applyTilt(0, 0);
    wasInZone = false;
  };

  let rafId: number;
  const onRafMove = (e: MouseEvent) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => onMove(e));
  };

  window.addEventListener('mousemove', onRafMove);
  document.documentElement.addEventListener('mouseleave', onLeave);
  return () => {
    window.removeEventListener('mousemove', onRafMove);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    cancelAnimationFrame(rafId);
  };
}

export function PhoneChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const mouseCleanupRef = useRef<(() => void) | null>(null);
  const { openApply } = useSiteUi();
  const { sim } = useSimulator();

  // Dynamic live device clock & message timestamps
  const [deviceTime, setDeviceTime] = useState<string>('10:33');
  const [msgTimes, setMsgTimes] = useState({
    t0: '10:30',
    t1: '10:31',
    t2: '10:32',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatTime = (d: Date) =>
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      setDeviceTime(formatTime(now));

      const m0 = new Date(now.getTime() - 2 * 60000);
      const m1 = new Date(now.getTime() - 1 * 60000);
      setMsgTimes({
        t0: formatTime(m0),
        t1: formatTime(m1),
        t2: formatTime(now),
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 980px)').matches;
    const shell = shellRef.current;
    const chatBody = chatBodyRef.current;
    if (!shell || !chatBody) return;

    const bubbles = Array.from(chatBody.querySelectorAll('[data-wa-bubble]'));
    const waBtns = chatBody.querySelector('[data-wa-btns]');

    if (reduceMotion) {
      bubbles.forEach(b => gsap.set(b, { autoAlpha: 1, y: 0 }));
      if (waBtns) gsap.set(waBtns, { autoAlpha: 1, y: 0 });
      chatBody.scrollTop = chatBody.scrollHeight;
      return;
    }

    gsap.set(bubbles, { autoAlpha: 0, y: 10 });
    if (waBtns) gsap.set(waBtns, { autoAlpha: 0, y: 10 });

    const tl = gsap.timeline({ delay: 0.1 });

    // Smooth sequence revealing the full conversation under 1.2s
    tl.to(bubbles, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.14,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => {
        chatBody.scrollTop = chatBody.scrollHeight;
      },
    });

    if (waBtns) {
      tl.to(waBtns, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          chatBody.scrollTop = chatBody.scrollHeight;
        },
      }, '-=0.1');
    }

    tl.call(() => {
      gsap.set(shell, { clearProps: 'transform' });
      if (containerRef.current) {
        mouseCleanupRef.current = startMouseTilt(shell, containerRef.current);

        const heroSection = containerRef.current.closest('section[aria-labelledby="hero-heading"]');
        if (heroSection && isDesktop) {
          gsap.to(shell, {
            y: -25,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }
    });

    return () => {
      mouseCleanupRef.current?.();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="phone-wrapper select-none" aria-hidden="true">
      <div ref={shellRef} className="phone" data-phone="shell">
        <div className="phone-body">
          <div className="phone-shine" aria-hidden="true" />
          <div className="phone-screen">
            
            {/* Dynamic Island */}
            <div className="phone-island" aria-hidden="true" />

            {/* 1. WhatsApp Status Bar with Live Device Clock */}
            <div className="wa-status-bar">
              <span className="tabular-nums">{deviceTime}</span>
              <div className="wa-status-icons">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                  <rect x="0" y="7" width="2.5" height="3" rx="0.5" />
                  <rect x="3.8" y="5" width="2.5" height="5" rx="0.5" />
                  <rect x="7.6" y="2.5" width="2.5" height="7.5" rx="0.5" />
                  <rect x="11.4" y="0" width="2.5" height="10" rx="0.5" />
                </svg>
                <svg width="13" height="10" viewBox="0 0 16 12" fill="currentColor">
                  <path d="M8 2.2C10.5 2.2 12.7 3.2 14.3 4.8L13 6.1C11.7 4.8 10 4 8 4S4.3 4.8 3 6.1L1.7 4.8C3.3 3.2 5.5 2.2 8 2.2Z" />
                  <path d="M8 5.6C9.2 5.6 10.3 6.1 11.1 6.9L8 10 4.9 6.9C5.7 6.1 6.8 5.6 8 5.6Z" />
                </svg>
                <div className="w-4.5 h-2.5 rounded-[3px] border border-white p-[1px] flex items-center">
                  <div className="w-full h-full bg-white rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* 2. WhatsApp Header */}
            <div className="wa-header">
              <div className="wa-back-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>

              {/* Official Plataxi Vector Logo in circle */}
              <div className="wa-avatar">
                <svg viewBox="0 0 512 512" className="w-full h-full">
                  <defs>
                    <mask id="phone-chat-green-mask">
                      <rect width="512" height="512" fill="white" />
                      <g transform="translate(230, 256) rotate(45)">
                        <rect x="-100" y="-100" width="200" height="200" rx="44" fill="black" stroke="black" strokeWidth="32" strokeLinejoin="round" />
                      </g>
                    </mask>
                    <mask id="phone-chat-orange-mask">
                      <rect width="512" height="512" fill="white" />
                      <g transform="translate(326, 256) rotate(45)">
                        <rect x="-100" y="-100" width="200" height="200" rx="44" fill="black" stroke="black" strokeWidth="32" strokeLinejoin="round" />
                      </g>
                    </mask>
                  </defs>
                  <g transform="translate(18, 0)">
                    <g mask="url(#phone-chat-green-mask)">
                      <g transform="translate(134, 256) rotate(45)">
                        <rect x="-100" y="-100" width="200" height="200" rx="44" fill="#387758" />
                      </g>
                    </g>
                    <g mask="url(#phone-chat-orange-mask)">
                      <g transform="translate(230, 256) rotate(45)">
                        <rect x="-100" y="-100" width="200" height="200" rx="44" fill="#dd6a44" />
                      </g>
                    </g>
                    <g transform="translate(326, 256) rotate(45)">
                      <rect x="-100" y="-100" width="200" height="200" rx="44" fill="#0d2c51" />
                    </g>
                  </g>
                </svg>
              </div>

              <div className="wa-info">
                <div className="wa-name">
                  {config.brandName}
                  <svg className="w-3.5 h-3.5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 14.5l-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8z" />
                  </svg>
                </div>
                <div className="wa-online">en línea</div>
              </div>

              <div className="wa-actions">
                {/* Video Call */}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
                {/* Audio Call */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.37-.67.25-1.02A11.36 11.36 0 019 4.31c0-.55-.45-1-1-1H4.5c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.93c0-.55-.45-1-.99-1z" />
                </svg>
                {/* 3 Dots Menu */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </div>

            {/* 3. WhatsApp Wallpaper & Chat Stream */}
            <div className="wa-wallpaper">
              
              {/* Subtle WhatsApp Doodles Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="wa-chat-doodles" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path d="M20 25h14v8c0 3-2 5-5 5h-4c-3 0-5-2-5-5v-8zm14 2h4c2 0 3 1 3 3s-1 3-3 3h-4v-6z" fill="none" stroke="#111B21" strokeWidth="1.5" />
                  <path d="M75 20h20c3 0 5 2 5 5v10c0 3-2 5-5 5h-10l-6 4v-4h-4c-3 0-5-2-5-5V25c0-3 2-5 5-5z" fill="none" stroke="#111B21" strokeWidth="1.5" />
                  <circle cx="35" cy="80" r="10" fill="none" stroke="#111B21" strokeWidth="1.5" />
                  <circle cx="32" cy="78" r="1" fill="#111B21" />
                  <circle cx="38" cy="78" r="1" fill="#111B21" />
                  <path d="M31 83c1.5 2 6.5 2 8 0" fill="none" stroke="#111B21" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M85 80l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="none" stroke="#111B21" strokeWidth="1.2" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#wa-chat-doodles)" />
              </svg>

              <div ref={chatBodyRef} className="wa-chat-body">
                {/* Date Badge */}
                <div className="wa-date-pill">HOY</div>

                {/* ── GROUP 1: Laura (Outgoing Message with Tail) ──── */}
                <div data-wa-bubble className="wa-bubble wa-bubble-me wa-has-tail">
                  ¡Hola! Necesito {fmtCOP(phoneSim.amount)} para una emergencia.
                  <div className="wa-meta">
                    <span className="tabular-nums">{msgTimes.t0}</span>
                    <span className="whatsapp-ticks" aria-hidden="true" />
                  </div>
                </div>

                {/* ── GROUP 2: Plataxi (Incoming Sequence) ────────── */}
                {/* 2.1 First Message with Left Tail */}
                <div data-wa-bubble className="wa-bubble wa-bubble-them wa-has-tail mt-1">
                  ¡Hola Laura! Te comparto el cálculo preliminar para tu crédito:
                  <div className="wa-meta">
                    <span className="tabular-nums">{msgTimes.t0}</span>
                  </div>
                </div>

                {/* 2.2 Consecutive Simulation Card (No tail, Clean Typography) */}
                <div data-wa-bubble className="wa-card">
                  <div className="wa-card-header">
                    Resumen de tu crédito
                  </div>
                  <div className="wa-card-row"><strong>Monto:</strong> {fmtCOP(phoneSim.amount)}</div>
                  <div className="wa-card-row"><strong>Plazo:</strong> {phoneSim.term} meses</div>
                  <div className="wa-card-row"><strong>Cuota:</strong> {fmtCOP(phoneSim.payment)} / mes</div>
                  <div className="wa-card-row text-[10px] text-[#667781] pt-0.5 border-t border-[#f0f2f5] mt-1">
                    Tasa: 2,6% m.v. (36,07% E.A.)
                  </div>
                  <div className="wa-meta">
                    <span className="tabular-nums">{msgTimes.t1}</span>
                  </div>
                </div>

                {/* 2.3 Consecutive Disclaimer Note (No tail, Subtle) */}
                <div data-wa-bubble className="wa-note">
                  <div className="font-medium text-[#856404]">
                    *Valores estimados sujetos a verificación digital.
                  </div>
                  <div className="wa-meta">
                    <span className="tabular-nums">{msgTimes.t1}</span>
                  </div>
                </div>

                {/* ── GROUP 3: Laura (Outgoing with Tail) ──────────── */}
                <div data-wa-bubble className="wa-bubble wa-bubble-me wa-has-tail mt-1">
                  ¿Cómo inicio mi solicitud?
                  <div className="wa-meta">
                    <span className="tabular-nums">{msgTimes.t2}</span>
                    <span className="whatsapp-ticks" aria-hidden="true" />
                  </div>
                </div>

                {/* ── GROUP 4: Plataxi (Incoming with Tail) ───────── */}
                <div data-wa-bubble className="wa-bubble wa-bubble-them wa-has-tail mt-1">
                  Elige cómo prefieres continuar:
                  <div className="wa-meta">
                    <span className="tabular-nums">{msgTimes.t2}</span>
                  </div>
                </div>

                {/* ── GROUP 5: Interactive Action Buttons ──────────── */}
                <div data-wa-btns className="wa-btn-group">
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => openApply('direct')}
                    className="wa-cta-btn wa-cta-btn-primary"
                  >
                    Iniciar solicitud digital
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      track('whatsapp_click', { ctx: 'hero' });
                      window.open(buildWhatsAppUrl('hero', sim), '_blank', 'noopener,noreferrer');
                    }}
                    className="wa-cta-btn"
                  >
                    Hablar con un asesor
                  </button>
                </div>

              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 4. ANDROID WHATSAPP BOTTOM INPUT DOCK                         */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="wa-input-dock">
              {/* 1. Main Text Input Box (White Rounded Capsule) */}
              <div className="wa-input-capsule">
                <div className="wa-input-left">
                  {/* Leftmost Icon: Gray Simple Smiley Emoji Button */}
                  <div className="wa-emoji-btn" aria-hidden="true">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
                      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
                    </svg>
                  </div>
                  {/* Center Area: Text Placeholder */}
                  <span className="wa-input-placeholder">Escribe un mensaje</span>
                </div>

                {/* Rightmost Icons (Grouped closely inside the white box) */}
                <div className="wa-input-right-icons" aria-hidden="true">
                  {/* Gray Paperclip Icon tilted at an angle */}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}>
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  {/* Gray Camera Icon */}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>

              {/* 2. Voice Note Button (Separate solid teal/cyan-green circle) */}
              <div className="wa-mic-fab" aria-label="Nota de voz">
                {/* Sharp White Microphone Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
            </div>

          </div>
        </div>
        <div className="phone-glow" aria-hidden="true" />
      </div>
    </div>
  );
}
