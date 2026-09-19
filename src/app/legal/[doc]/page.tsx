import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { config } from "@/lib/config";

/**
 * Legal pages — terminos | privacidad | seguridad. Intentionally placeholder
 * drafts (real copy authored by legal before launch) and noindex. Reached via
 * /legal/<doc> and the Spanish rewrites /terminos · /privacidad.
 */
const DOCS: Record<string, string> = {
  terminos: "Términos y condiciones",
  privacidad: "Política de Privacidad",
  seguridad: "Política de Seguridad",
  "habeas-data": "Tratamiento de Datos Personales (Habeas Data)",
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const title = DOCS[doc];
  return {
    title: title ? `${title} — ${config.brandName}` : `Legal — ${config.brandName}`,
    description:
      `Documentos legales de ${config.brandName}: términos y condiciones, política de privacidad y tratamiento de datos.`,
    robots: { index: false, follow: false },
  };
}

const Skeleton = () => (
  <div className="legal-skeleton">
    <span />
    <span />
    <span />
    <span />
  </div>
);

export default async function LegalDoc({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const title = DOCS[doc];
  if (!title) notFound();

  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <Link className="legal-back" href="/">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18 l-6-6 6-6" />
          </svg>
          Volver a {config.brandName}
        </Link>

        <p className="legal-eyebrow">Documento legal</p>
        <h1>{title}</h1>
        <p className="legal-meta">Última actualización: pendiente</p>

        <div className="legal-draft">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9 v4 M12 17 h.01" />
            <path d="M10.3 3.9 1.8 18.5 a2 2 0 0 0 1.7 3 h17 a2 2 0 0 0 1.7-3 L13.7 3.9 a2 2 0 0 0-3.4 0Z" />
          </svg>
          <p>
            <b>Borrador de prototipo.</b> Este documento es un marcador de
            posición. El texto legal definitivo debe ser redactado y revisado por
            el equipo legal de {config.brandName} antes de publicar.
          </p>
        </div>

        <div className="legal-body">
          {doc === "terminos" ? (
            <div className="space-y-8 pt-2">
              <section className="space-y-3">
                <h2>1. Objeto y Operación del Servicio</h2>
                <p>
                  <strong>{config.brandName}</strong> ofrece soluciones de crédito y financiamiento productivo para conductores y aliados del transporte en Colombia. Todas las operaciones se formalizan bajo títulos valores electrónicos (Pagaré Digital con firma electrónica) y se liquidan conforme a los marcos regulatorios de la Superintendencia Financiera de Colombia (SFC) y el Código de Comercio.
                </p>
              </section>

              <section className="space-y-3">
                <h2>2. Matriz de Montos, Plazos y Formas de Pago</h2>
                <p>
                  Las solicitudes de crédito están sujetas a la siguiente matriz operativa según el monto de capital aprobado:
                </p>
                <div
                  tabIndex={0}
                  role="region"
                  aria-labelledby="matriz-caption"
                  className="overflow-x-auto rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <table className="w-full text-xs text-left border border-border rounded-lg overflow-hidden">
                    <caption id="matriz-caption" className="sr-only">Matriz de montos, plazos y formas de pago</caption>
                    <thead className="bg-muted font-bold text-navy">
                      <tr>
                        <th scope="col" className="p-2.5 border-b border-border">Rango de Monto</th>
                        <th scope="col" className="p-2.5 border-b border-border">Plazo Disponible</th>
                        <th scope="col" className="p-2.5 border-b border-border">Formas de Pago</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-2.5 font-medium">$100.000 a $150.000</td>
                        <td className="p-2.5">Solo 1 mes (Obligatorio)</td>
                        <td className="p-2.5">Solo Diario (divide en 30)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">$200.000 a $250.000</td>
                        <td className="p-2.5">1 o 2 meses de plazo</td>
                        <td className="p-2.5">Diario o Semanal (divide en 30 o 4)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">$300.000 a $600.000</td>
                        <td className="p-2.5">1, 2 o 3 meses de plazo</td>
                        <td className="p-2.5">Diario, Semanal o Quincenal (/30, /4, /2)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">$600.000 a $1.000.000</td>
                        <td className="p-2.5">1, 2 o 3 meses de plazo</td>
                        <td className="p-2.5">Diario, Semanal, Quincenal o Mensual (/30, /4, /2, /1)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  * Plazo y forma de pago inmutables tras desembolso — ver{' '}
                  <Link href="#inmutabilidad" className="underline font-semibold hover:text-foreground">
                    §5 Inmutabilidad
                  </Link>
                  .
                </p>
              </section>

              <section className="space-y-3">
                <h2>3. Tasas de Interés y Fórmulas de Liquidación</h2>
                <p>
                  El interés legal aplicable se calcula sobre el capital solicitado con base en la tasa legal autorizada por el gobierno nacional (3,4% mensual simple), acumulándose mes a mes según el plazo pactado:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Plazo 1 Mes:</strong> equivale al <strong>3,4%</strong> sobre el capital.</li>
                  <li><strong>Plazo 2 Meses:</strong> equivale al <strong>6,8%</strong> sobre el capital (sumatoria de 2 meses).</li>
                  <li><strong>Plazo 3 Meses:</strong> equivale al <strong>10,2%</strong> sobre el capital (sumatoria de 3 meses).</li>
                </ul>

                <h3 className="text-base font-bold pt-2">3.1 Fórmulas de Liquidación</h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs space-y-1.5">
                    <h4 className="font-bold text-navy text-sm">A. Fórmula Base (Sin servicios opcionales)</h4>
                    <p className="text-muted-foreground">
                      Aplica cuando el prestatario no autoriza los servicios de plataforma y fianza:
                    </p>
                    <div className="font-mono bg-background p-2 rounded border border-border text-[11px]">
                      Total a Pagar = Capital + (Capital × % Interés de Plazo)
                    </div>
                    <div className="font-mono bg-background p-2 rounded border border-border text-[11px]">
                      Cuota Periódica = Total a Pagar / Divisor de Forma de Pago
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs space-y-1.5">
                    <h4 className="font-bold text-navy text-sm">B. Fórmula con Servicios Opcionales (Plataforma + Fianza)</h4>
                    <p className="text-muted-foreground">
                      Aplica cuando el prestatario autoriza los servicios de valor agregado:
                    </p>
                    <div className="font-mono bg-background p-2 rounded border border-border text-[11px]">
                      Total a Pagar = Capital + (Capital × % Interés de Plazo) + (Capital × 3,0% Plataforma) + (Capital × 3,6% Fianza)
                    </div>
                    <div className="font-mono bg-background p-2 rounded border border-border text-[11px]">
                      Cuota Periódica = Total a Pagar / Divisor de Forma de Pago
                    </div>
                  </div>
                </div>

                <h3 className="text-base font-bold pt-2">3.2 Divisores de Cuota según Forma de Pago</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Forma de pago DIARIO:</strong> divide el total a pagar en <strong>30</strong> cuotas.</li>
                  <li><strong>Forma de pago SEMANAL:</strong> divide el total a pagar en <strong>4</strong> cuotas.</li>
                  <li><strong>Forma de pago QUINCENAL:</strong> divide el total a pagar en <strong>2</strong> cuotas.</li>
                  <li><strong>Forma de pago MENSUAL:</strong> divide el total a pagar en <strong>1</strong> cuota (deja igual).</li>
                </ul>
              </section>

              <section id="servicios-opcionales" tabIndex={-1} className="space-y-4 scroll-mt-20">
                <h2>4. Servicios Opcionales de Valor Agregado</h2>
                <p className="text-sm leading-relaxed">
                  Conforme a la normativa de la Superintendencia Financiera de Colombia, los siguientes servicios son de carácter <strong>estrictamente opcional</strong> y requieren autorización previa y voluntaria del usuario:
                </p>

                <div className="p-4 rounded-xl bg-muted/40 border border-border text-sm space-y-2">
                  <h3 className="font-bold text-foreground">4.1 Servicio de Plataforma Tecnológica (+3.0% sobre el capital)</h3>
                  <p>Beneficios para el conductor:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Recibes tu dinero en 15 minutos</strong> en tu cuenta o billetera digital.</li>
                    <li><strong>Consulta tus pagos e historial</strong> en tiempo real desde tu celular cuando quieras.</li>
                    <li><strong>Subes de nivel de conductor</strong> para calificar a préstamos de mayor monto.</li>
                    <li><strong>Recordatorios automáticos por WhatsApp</strong> para que nunca se te pase una cuota.</li>
                    <li><strong>Pagos más seguros</strong> con comprobante de pago digital al instante.</li>
                  </ul>
                  <p className="text-xs text-muted-foreground pt-1">
                    <strong>En caso de no autorizar:</strong> El desembolso se procesará mediante transferencia bancaria ordinaria (24 a 48 horas hábiles) y las consultas de saldo requerirán solicitud manual vía ticket.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border text-sm space-y-2">
                  <h3 className="font-bold text-foreground">4.2 Servicio de Fianza de Respaldo (+3.6% sobre el capital)</h3>
                  <p>Beneficios de garantía y respaldo:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Prórroga de hasta 2 días:</strong> Si un día no puedes pagar por imprevisto o pico y placa, cuentas con hasta 48 horas de gracia sin cobro de mora.</li>
                    <li><strong>Cero afectación de historial:</strong> No afecta tu historial crediticio ni calificación interna en la plataforma.</li>
                    <li><strong>Acumulación de prórrogas:</strong> Si nunca las has utilizado, se acumulan para futuros créditos solicitados.</li>
                  </ul>
                  <p className="text-xs text-muted-foreground pt-1">
                    <strong>En caso de no autorizar:</strong> Cualquier retraso o impago causará de inmediato intereses de mora legales y suspensión de renovaciones.
                  </p>
                </div>
              </section>

              <section id="inmutabilidad" tabIndex={-1} className="space-y-3 scroll-mt-20">
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-sm space-y-2">
                  <h3 className="font-bold text-foreground">5. Inmutabilidad de Plazo y Forma de Pago</h3>
                  <p className="font-semibold text-foreground">
                    &ldquo;La persona no puede cambiar ni el plazo ni la forma de pago después de tomado el crédito.&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Una vez formalizada la solicitud y emitido el pagaré digital con la modalidad escogida (diario, semanal, quincenal o mensual), los términos quedan sellados de forma definitiva para la vida del crédito sin posibilidad de novación ni reestructuración unilateral.
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h2>6. Tratamiento de Datos Personales (Habeas Data)</h2>
                <p>
                  {config.brandName} trata los datos personales y crediticios de sus usuarios en estricto cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013. Los datos son utilizados exclusivamente para la evaluación crediticia, validación de identidad, prevención del fraude y gestión operativa del crédito.
                </p>
              </section>
            </div>
          ) : (
            <>
              <h2>1. Información general</h2>
              <Skeleton />
              <h2>2. Condiciones del servicio</h2>
              <Skeleton />
              <h2>3. Tratamiento de datos personales</h2>
              <p>
                {config.brandName} trata los datos personales de sus usuarios conforme a la Ley
                1581 de 2012 (Habeas Data) y demás normativa colombiana aplicable.
              </p>
              <Skeleton />
            </>
          )}
        </div>

        <p className="legal-foot">
          ¿Tienes preguntas sobre este documento? Escríbenos por{" "}
          <a href={`https://wa.me/${config.whatsappPhone}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          .
        </p>
      </div>
    </div>
  );
}
