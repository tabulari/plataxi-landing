import { config } from './config';
import { fmtCOP } from './credit';

export interface Faq {
  q: string;
  answer: string;
  icon?: 'shield' | 'bolt' | 'document' | 'refresh' | 'star';
}

export const FAQS: Faq[] = [
  {
    q: '¿Qué incluye mi cuota? ¿Hay intereses ocultos?',
    answer: `Sin interés oculto. Tu cuota 1 a 6 meses ya incluye solo dos rubros fijos y claros: administración ($${fmtCOP(config.credit.adminFeeTotal)} total prorrateado por cuota) y fianza ($${fmtCOP(config.credit.guaranteeFeeTotal)} total). Eliges abono diario, semanal, quincenal o mensual y pagas cuota fija sin sorpresas.`,
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
      'Sí. Puedes liquidar de 1 a 6 meses cuando quieras sin penalidad. Pagas solo las cuotas causadas hasta ese día (administración prorrateada incluida) y te liberas de las cuotas restantes.',
    icon: 'refresh',
  },
  {
    q: '¿Puedo aplicar si no tengo historial crediticio bancario?',
    answer:
      'Sí. No necesitas historial bancario tradicional; evaluamos tus ingresos y actividad como conductor para abrirte las puertas al crédito.',
    icon: 'star',
  },
];
