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

    const header = containerRef.current?.querySelector('[data-faq="header"]');
    const items = containerRef.current?.querySelectorAll('[data-faq="item"]');

    if (header) {
      gsap.fromTo(
        header,
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            once: true,
          },
        },
      );
    }

    if (items && items.length) {
      gsap.fromTo(
        items,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: items[0],
            start: 'top 85%',
            once: true,
          },
        },
      );
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="preguntas"
      aria-labelledby="faq-heading"
      className="mt-16 md:mt-32 relative"
    >
      <div className="mx-auto max-w-container px-6">
        {/* Centred header + single stacked column, as in the reference. */}
        <div data-faq="header" className="text-center max-w-2xl mx-auto space-y-2 mb-10 lg:mb-12">
          <h2 id="faq-heading" className="text-section font-display font-bold text-navy">
            Todo claro sobre tu crédito
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
            Todo lo que necesitas saber antes de solicitar, explicado con honestidad y sin tecnicismos bancarios.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion className="space-y-3 min-w-0">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                data-faq="item"
                className="rounded-lg bg-surface-card overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-5 text-left text-base font-bold text-navy hover:no-underline gap-4">
                  <span className="leading-snug text-left">{faq.q}</span>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-5 pt-0 text-left">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still-have-a-question bar, now centred under the stack */}
        <div className="max-w-3xl mx-auto mt-10 pt-8 border-t border-border/70 text-center space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-navy">¿Tienes una duda diferente?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nuestro equipo te atiende directamente por WhatsApp para revisar tu caso particular en minutos.
            </p>
          </div>

          <WhatsAppLink
            ctx="faq"
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-surface-card text-navy font-bold text-sm transition-all active:scale-[0.98]"
          >
            <WhatsAppIcon size={18} className="text-[#25D366] shrink-0" />
            <span>Hablar con un asesor</span>
          </WhatsAppLink>
        </div>

        {/* Static noscript fallback for crawlers & non-JS */}
        <noscript>
          <div className="max-w-3xl mx-auto flex flex-col gap-3 mt-8">
            {FAQS.map(({ q, answer }, i) => (
              <details key={i} className="border border-border rounded-xl p-4">
                <summary className="text-sm font-bold text-navy cursor-pointer">{q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
