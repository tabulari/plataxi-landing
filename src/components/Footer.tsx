import Link from 'next/link';
import Image from 'next/image';
import { config } from '@/lib/config';
import { WhatsAppLink } from './WhatsAppLink';

export function Footer() {
  return (
    <footer data-slot="footer" className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] text-white border-t border-white/10">
      <div className="mx-auto max-w-container px-6 pt-12 pb-10 lg:pt-16 lg:pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand & Social */}
        <div className="sm:col-span-2 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <a href="#top" aria-label={`${config.brandName} — inicio`} className="inline-flex items-center">
              <Image
                src="/plataxi-logo.jpeg"
                alt="Plataxi"
                width={140}
                height={52}
                className="h-12 w-auto object-contain rounded-md"
              />
            </a>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Crédito digital simple, ágil y 100% transparente en Colombia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={config.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 8 h2.5 V5 H14 c-2 0-3.3 1.3-3.3 3.4 V10 H8 v3 h2.7 v8 h3.3 v-8 H16 l.5-3 h-2.8 V8.8 C13.7 8.2 14 8 14 8Z" />
              </svg>
            </a>
            <a
              href={config.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={config.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 4 a1.8 1.8 0 1 0 0 3.6 A1.8 1.8 0 0 0 5 4Z M3.4 9 H6.6 V20 H3.4Z M9 9 h3 v1.5 c.5-.9 1.7-1.8 3.3-1.8 3 0 3.7 1.9 3.7 4.5 V20 h-3.2 v-5.2 c0-1.2-.4-2-1.5-2 -1 0-1.6.7-1.6 2 V20 H9Z" />
              </svg>
            </a>
            <a
              href={config.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 8 a3 3 0 0 0-2.1-2.1C18 5.4 12 5.4 12 5.4 s-6 0-7.9.5 A3 3 0 0 0 2 8 a31 31 0 0 0 0 8 a3 3 0 0 0 2.1 2.1 c1.9.5 7.9.5 7.9.5 s6 0 7.9-.5 A3 3 0 0 0 22 16 a31 31 0 0 0 0-8Z M10 15 V9 l5 3 Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Legal & Plataforma */}
        <nav aria-label="Plataforma" className="flex flex-col space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Plataforma</h3>
          <Link href="/legal/terminos" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[38px]">
            Términos y condiciones
          </Link>
          <Link href="/legal/privacidad" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[38px]">
            Política de privacidad
          </Link>
          <Link href="/legal/habeas-data" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[38px]">
            Tratamiento de datos
          </Link>
        </nav>

        {/* Column 3: Soporte & Contacto */}
        <nav aria-label="Soporte" className="flex flex-col space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Soporte</h3>
          <a href="#preguntas" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[38px]">
            Centro de ayuda
          </a>
          <WhatsAppLink ctx="contact" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[38px]">
            Contacto
          </WhatsAppLink>
          <WhatsAppLink ctx="pqrs" className="text-sm text-white/70 hover:text-white transition-colors flex items-center min-h-[38px]">
            PQRS
          </WhatsAppLink>
        </nav>
      </div>

      {/* Single Unified Compliance Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {config.brandName}. Todos los derechos reservados.</p>
          <p>Sujeto a la Ley 1581 de 2012 (Habeas Data).</p>
        </div>
      </div>
    </footer>
  );
}
