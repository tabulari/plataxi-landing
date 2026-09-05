export interface Faq {
  q: string;
  answer: string;
  icon?: 'shield' | 'bolt' | 'document' | 'refresh' | 'star';
}

export const FAQS: Faq[] = [
  {
    q: '¿Qué tasa y costo total aplica a mi cuota?',
    answer:
      'Tasa fija del 2,6% mensual (TEA 36,07%). Tu cuota ya incluye los intereses según el monto y plazo que elijas, sin cobros ocultos ni sorpresas.',
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
      'Sí. Puedes hacer abonos a capital o liquidar toda la deuda cuando quieras sin ninguna penalidad, pagando únicamente los intereses del tiempo utilizado.',
    icon: 'refresh',
  },
  {
    q: '¿Puedo aplicar si no tengo historial crediticio bancario?',
    answer:
      'Sí. No necesitas historial bancario tradicional; evaluamos tus ingresos y actividad como conductor para abrirte las puertas al crédito.',
    icon: 'star',
  },
];
