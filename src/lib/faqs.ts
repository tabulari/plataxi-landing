export interface Faq {
  q: string;
  verdict: string;
  explanation: string;
  icon: 'shield' | 'bolt' | 'document' | 'refresh' | 'star';
}

export const FAQS: Faq[] = [
  {
    q: '¿Qué tasa y costo total aplica a mi cuota?',
    verdict: 'Tasa fija 2,6% m.v. (TEA 36,07% E.A.). Total con intereses e interés estimado se calculan según el monto y plazo que elijas.',
    explanation:
      'Tu cuota ya incluye la tasa fija mensual. Al validar tu perfil confirmamos el total con intereses y el interés estimado para tu plazo exacto. Todo queda claro antes de pedir el crédito.',
    icon: 'document',
  },
  {
    q: '¿Simular o solicitar me baja puntos o afecta en Datacrédito?',
    verdict: 'No, simular no afecta tu historial ni baja tu puntaje en centrales de riesgo.',
    explanation:
      'Puedes cotizar diferentes montos y plazos con total libertad. La validación formal solo se realiza si decides enviar tu solicitud definitiva.',
    icon: 'shield',
  },
  {
    q: '¿Cuánto demora en llegar el dinero a mi cuenta o Nequi?',
    verdict: 'La evaluación toma minutos y la plata te llega de una vez tras aceptar la oferta.',
    explanation:
      'Transferimos los fondos directamente a tu Nequi, DaviPlata o cuenta bancaria tan pronto confirmes las condiciones.',
    icon: 'bolt',
  },
  {
    q: '¿Tengo que pagar algo antes de recibir el dinero?',
    verdict: 'No. Cero cobros por adelantado, cero pólizas y cero cobros ocultos.',
    explanation:
      'Nunca te pediremos plata antes de prestarte. El estudio es 100% gratuito y solo comienzas a pagar tus cuotas después de tener el dinero en tu cuenta.',
    icon: 'document',
  },
  {
    q: '¿Puedo pagar mi crédito antes de tiempo sin penalidades?',
    verdict: 'Sí, puedes hacer abonos a capital o liquidar el crédito anticipadamente sin ningún cobro extra.',
    explanation:
      'Tienes total libertad para pagar cuando quieras, liquidando únicamente los intereses del tiempo que utilizaste el dinero.',
    icon: 'refresh',
  },
  {
    q: '¿Puedo aplicar si no tengo historial crediticio bancario?',
    verdict: 'Sí, puedes aplicar incluso si estás iniciando tu vida crediticia o no tienes historial previo.',
    explanation:
      'Evaluamos tu perfil de forma integral con modelos propios para darte la oportunidad de acceder y construir tu historial financiero.',
    icon: 'star',
  },
];
