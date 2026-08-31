import Link from 'next/link';
import { config } from '@/lib/config';
import { WhatsAppLink } from './WhatsAppLink';
import { PlataxiWordmark } from './icons';

export function Footer() {
  return (
    <footer data-slot="footer" className="bg-gradient-to-b from-primary-dark to-[#0a0a0a] text-white border-t border-white/10">
      <div className="mx-auto max-w-container px-6 pt-12 pb-10 lg:pt-16 lg:pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand & Social */}
        <div className="sm:col-span-2 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <a href="#top" aria-label={`${config.brandName} — inicio`} className="inline-flex items-center">
              <PlataxiWordmark variant="white" height={32} />
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
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:bg-green hover:text-ink hover:scale-105 transition-all shrink-0"
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
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:bg-green hover:text-ink hover:scale-105 transition-all shrink-0"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Legal & Plataforma */}
        <nav aria-label="Plataforma" className="flex flex-col space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Plataforma</h3>
          <Link href="/legal/terminos" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[38px]">
            Términos y condiciones
          </Link>
          <Link href="/legal/privacidad" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[38px]">
            Política de privacidad
          </Link>
          <Link href="/legal/habeas-data" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[38px]">
            Tratamiento de datos
          </Link>
        </nav>

        {/* Column 3: Soporte & Contacto */}
        <nav aria-label="Soporte" className="flex flex-col space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Soporte</h3>
          <a href="#preguntas" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[38px]">
            Centro de ayuda
          </a>
          <WhatsAppLink ctx="contact" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[38px]">
            Contacto
          </WhatsAppLink>
          <WhatsAppLink ctx="pqrs" className="text-sm text-white/70 hover:text-green transition-colors flex items-center min-h-[38px]">
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
