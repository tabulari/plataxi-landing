'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Faq() {
  const containerRef = useRef<HTMLElement>(null);
  // 10. Deep-link: #faq-2 abre y scrollea la pregunta
  const [value, setValue] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#faq-')) {
      const h = window.location.hash.slice(1);
      if (FAQS.some((_, i) => `faq-${i}` === h)) return [h];
    }
    return ['faq-0'];
  });
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('faq-') && FAQS.some((_, i) => `faq-${i}` === hash)) {
      setValue((prev) => (prev.includes(hash) ? prev : [...prev, hash]));
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    const onHashChange = () => {
      const h = window.location.hash.slice(1);
      if (h.startsWith('faq-') && FAQS.some((_, i) => `faq-${i}` === h)) {
        setValue((prev) => (prev.includes(h) ? prev : [...prev, h]));
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleValueChange = (newVal: string[]) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && newVal.length > 1) {
      setValue([newVal[newVal.length - 1]]);
    } else {
      setValue(newVal);
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const root = containerRef.current;
        if (!root) return;
        gsap.set(root.querySelectorAll('[data-faq="header"], [data-faq="item"]'), {
          autoAlpha: 1,
          y: 0,
          clearProps: 'transform',
        });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = containerRef.current;
        if (!root) return;
        const header = root.querySelector('[data-faq="header"]');
        const items = root.querySelectorAll<HTMLElement>('[data-faq="item"]');
        if (header) {
          gsap.fromTo(
            header,
            { y: 14, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.35,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: root,
                start: 'top 80%',
                once: true,
              },
            },
          );
        }
        if (items.length) {
          gsap.fromTo(
            items,
            { y: 14, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.06,
              duration: 0.35,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: root,
                start: 'top 80%',
                once: true,
              },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: containerRef },
  );

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
          <Accordion className="space-y-3" multiple value={value} onValueChange={handleValueChange}>
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                id={`faq-${i}`}
                value={`faq-${i}`}
                data-faq="item"
                className="rounded-lg bg-surface-card overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-5 text-left text-base font-bold text-navy hover:no-underline gap-4 active:scale-[0.97] transition-transform">
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
      {/* 2. FAQPage JSON-LD para indexación aunque JS falle — single source con FAQS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />
    </section>
  );
}
