'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FAQS } from '@/lib/faqs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { WhatsAppLink } from './WhatsAppLink';
import { WhatsAppIcon } from './icons';

export function Faq() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const leftCol = containerRef.current?.querySelector('[data-faq="left"]');
    const rightCol = containerRef.current?.querySelector('[data-faq="right"]');

    if (leftCol) {
      gsap.fromTo(
        leftCol,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: leftCol, start: 'top 85%' },
        },
      );
    }

    if (rightCol) {
      gsap.fromTo(
        rightCol,
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: { trigger: rightCol, start: 'top 85%' },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="preguntas"
      aria-labelledby="faq-heading"
      className="py-14 sm:py-16 lg:py-20 bg-[#fffee9] relative"
    >
      <div className="mx-auto max-w-container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN: Pure Sticky Editorial Anchor & Direct Bar        */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div data-faq="left" className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-2 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-ink mb-1.5">
                Transparencia total
              </p>
              <h2
                id="faq-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-tight text-navy"
              >
                Claridad total sobre tu crédito
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
                Todo lo que necesitas saber antes de solicitar, explicado con honestidad y sin tecnicismos bancarios.
              </p>
            </div>

            {/* Clean Single-Action Direct Bar (Zero Badges, Zero Arrows, Zero Box Inception) */}
            <div className="border-t border-border/70 pt-6 space-y-4 text-left">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-navy">
                  ¿Tienes una duda diferente?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nuestro equipo te atiende directamente por WhatsApp para revisar tu caso particular en minutos.
                </p>
              </div>

              <WhatsAppLink
                ctx="faq"
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-bg-soft text-navy font-bold text-sm border border-border shadow-2xs hover:border-green/40 transition-all active:scale-[0.98]"
              >
                <WhatsAppIcon size={18} className="text-[#25D366] shrink-0" />
                <span>Hablar con un asesor</span>
              </WhatsAppLink>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN: Direct, Uncluttered Accordion (Zero Nesting)   */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div data-faq="right" className="lg:col-span-7 space-y-3">
            <Accordion className="space-y-3 min-w-0">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  data-faq="item"
                  className="rounded-2xl border border-border/80 bg-white hover:border-green/40 hover:shadow-2xs transition-all duration-200 overflow-hidden"
                >
                  <AccordionTrigger className="px-5 sm:px-6 py-4 sm:py-5 text-left text-base font-bold text-navy hover:no-underline gap-4">
                    <span className="leading-snug text-left">{faq.q}</span>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 sm:px-6 pb-5 pt-0 text-left">
                    {/* Direct, Honest Answer without Nested Containers */}
                    <div className="space-y-1.5 border-t border-border/40 pt-3">
                      <p className="text-sm sm:text-base font-bold text-navy leading-snug">
                        {faq.verdict}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.explanation}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Static noscript fallback for crawlers & non-JS */}
        <noscript>
          <div className="max-w-3xl mx-auto flex flex-col gap-3 mt-8">
            {FAQS.map(({ q, verdict, explanation }, i) => (
              <details key={i} className="border border-border rounded-xl p-4">
                <summary className="text-sm font-bold text-navy cursor-pointer">{q}</summary>
                <p className="mt-2 text-sm font-bold text-navy">{verdict}</p>
                <p className="mt-1 text-sm text-muted-foreground">{explanation}</p>
              </details>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
