import { config } from './config';
import { fmtPct } from './credit';

export interface Faq {
  q: string;
  answer: string;
  icon?: 'shield' | 'bolt' | 'document' | 'refresh' | 'star';
}

export interface FaqRates {
  /** Servicio de Plataforma, decimal del capital (ej. 0.030 = 3.0%). */
  platformFeeRate: number;
  /** Fianza, decimal del capital (ej. 0.036 = 3.6%). */
  guaranteeFeeRate: number;
}

/**
 * Las FAQ se construyen a partir de las tasas servidas por Core (financial_settings
 * vía rates-config): un solo source de verdad con el simulador. Nada de montos
 * planos en COP — los montos dependen del capital que elija el usuario.
 */
export function buildFaqs(rates: FaqRates): Faq[] {
  return [
    {
      q: '¿Qué incluye mi cuota? ¿Hay intereses ocultos?',
      answer: `Sin interés oculto. Tu cuota 1 a 3 meses ya incluye solo dos rubros fijos y claros: administración (${fmtPct(rates.platformFeeRate, 1)}% del capital, prorrateado por cuota) y fianza (${fmtPct(rates.guaranteeFeeRate, 1)}% del capital). Eliges abono diario, semanal, quincenal o mensual y pagas cuota fija sin sorpresas.`,
      icon: 'document',
    },
    {
      q: '¿Simular o solicitar me baja puntos o afecta en Datacrédito?',
      answer:
        'No. Simular es 100% libre y no baja tu puntaje. La consulta formal solo se realiza si decides enviar tu solicitud definitiva.',
      icon: 'shield',
    },
    {
      q: '¿Cuánto demora en llegar el dinero a mi cuenta o Nequi?',
      answer:
        'En minutos. Tan pronto apruebas las condiciones en tu celular, te transferimos el dinero directo a tu Nequi, DaviPlata o cuenta bancaria.',
      icon: 'bolt',
    },
    {
      q: '¿Tengo que pagar algo antes de recibir el dinero?',
      answer:
        'Nunca. El estudio es 100% gratuito y no cobramos pólizas ni adelantos. Solo comienzas a pagar tus cuotas después de tener el dinero en tu cuenta.',
      icon: 'document',
    },
    {
      q: '¿Puedo pagar mi crédito antes de tiempo sin penalidades?',
      answer:
        'Sí. Puedes liquidar de 1 a 3 meses cuando quieras sin penalidad. Pagas solo las cuotas causadas hasta ese día (administración prorrateada incluida) y te liberas de las cuotas restantes.',
      icon: 'refresh',
    },
    {
      q: '¿Puedo aplicar si no tengo historial crediticio bancario?',
      answer:
        'Sí. No necesitas historial bancario tradicional; evaluamos tus ingresos y actividad como conductor para abrirte las puertas al crédito.',
      icon: 'star',
    },
  ];
}

/** Fallback estático (tasas de config) para consumidores sin acceso a Core. */
export const FAQS: Faq[] = buildFaqs({
  platformFeeRate: config.credit.platformFeeRate,
  guaranteeFeeRate: config.credit.guaranteeFeeRate,
});
