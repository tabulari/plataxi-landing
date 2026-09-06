'use client';

import Link from 'next/link';
import { config } from '@/lib/config';
import { PlataxiWordmark } from './icons';

const HEADER_OFFSET = 80;

export function Footer() {
  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', href);
    }
  };
  return (
    <footer className="bg-primary-dark text-white border-t border-white/10">
      <div className="mx-auto max-w-container px-6 pt-12 pb-10 lg:pt-16 lg:pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand & Social */}
        <div className="sm:col-span-2 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <a
              href="#top"
              aria-label={`${config.brandName} — inicio`}
              onClick={(e) => handleHashClick(e, '#top')}
              className="inline-flex items-center min-h-[44px]"
            >
              <PlataxiWordmark variant="white" height={32} />
            </a>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Microcréditos para taxistas en Colombia. Sin filas, sin fiador y directo a tu cuenta.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={config.social.facebook}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="Facebook — se abre en pestaña nueva"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white/70 hover:bg-green hover:text-ink hover:scale-105 active:scale-[0.97] transition-all shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 8 h2.5 V5 H14 c-2 0-3.3 1.3-3.3 3.4 V10 H8 v3 h2.7 v8 h3.3 v-8 H16 l.5-3 h-2.8 V8.8 C13.7 8.2 14 8 14 8Z" />
              </svg>
            </a>
            <a
              href={config.social.instagram}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="Instagram — se abre en pestaña nueva"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white/70 hover:bg-green hover:text-ink hover:scale-105 active:scale-[0.97] transition-all shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={config.social.youtube}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="YouTube — se abre en pestaña nueva"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white/70 hover:bg-green hover:text-ink hover:scale-105 active:scale-[0.97] transition-all shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z M9.75 15.5V8.5L15.5 12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Legal & Plataforma */}
        <nav aria-label="Plataforma" className="flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Plataforma</h3>
          <Link href="/legal/terminos" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[44px]">
            Términos y condiciones
          </Link>
          <Link href="/legal/privacidad" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[44px]">
            Política de privacidad
          </Link>
          <Link href="/legal/habeas-data" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[44px]">
            Tratamiento de datos
          </Link>
        </nav>

        {/* Column 3: Soporte & Contacto — 1 WhatsApp site-wide kept in Simulator + FAQ, footer is legal/support only */}
        <nav aria-label="Soporte" className="flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Soporte</h3>
          <a
            href="#preguntas"
            onClick={(e) => handleHashClick(e, '#preguntas')}
            className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[44px]"
          >
            Centro de ayuda
          </a>
          <a href={`mailto:${config.contactEmail}`} className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[44px]">
            Contacto
          </a>
          <a
            href={`mailto:${config.contactEmail}?subject=PQRS%20-%20${encodeURIComponent(config.brandName)}`}
            className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[44px]"
          >
            PQRS
          </a>
        </nav>
      </div>

      {/* Single Unified Compliance Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-6 py-5 space-y-3">
          <p className="text-xs text-white/55 text-center leading-relaxed">
            {config.company.legalName} · NIT {config.company.nit} · {config.company.address} · {config.company.contactPhone}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55 text-center sm:text-left">
            <p suppressHydrationWarning>© {new Date().getFullYear()} {config.brandName}. Todos los derechos reservados.</p>
            <p>Sujeto a la Ley 1581 de 2012 (Habeas Data).</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
