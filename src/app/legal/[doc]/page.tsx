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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
          <h2>1. Información general</h2>
          <Skeleton />
          <h2>2. Condiciones del servicio</h2>
          <Skeleton />
          <h2>3. Tratamiento de datos personales</h2>
          <p>
            {config.brandName} trata los datos personales de sus usuarios conforme a la Ley
            1581 de 2012 (Habeas Data) y demás normativa colombiana aplicable. El
            contenido detallado de esta sección está pendiente de redacción.
          </p>
          <Skeleton />

          {doc === "terminos" && (
            <div id="servicios-opcionales" className="space-y-6 pt-4 border-t border-border/80">
              <h2>4. Servicios Opcionales de Valor Agregado</h2>
              <p className="text-sm leading-relaxed">
                Conforme a la normativa de la Superintendencia Financiera de Colombia, los siguientes servicios son de carácter <strong>estrictamente opcional</strong> y requieren autorización previa y voluntaria del usuario:
              </p>

              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 text-sm space-y-2">
                <h3 className="font-bold text-sky-900 dark:text-sky-200">4.1 Servicio de Plataforma Tecnológica (+3.0% sobre el capital)</h3>
                <p>Beneficios para el conductor:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Recibes tu dinero en 15 minutos</strong> en tu cuenta o billetera digital.</li>
                  <li><strong>Consulta tus pagos e historial</strong> en tiempo real desde tu celular cuando quieras.</li>
                  <li><strong>Subes de nivel de conductor</strong> para calificar a préstamos de mayor monto.</li>
                  <li><strong>Recordatorios automáticos por WhatsApp</strong> para que nunca se te pase una cuota.</li>
                  <li><strong>Pagos más seguros</strong> con comprobante de pago digital al instante.</li>
                </ul>
                <p className="text-xs text-amber-800 dark:text-amber-300 pt-1">
                  <strong>En caso de no autorizar:</strong> El desembolso se procesará mediante transferencia bancaria ordinaria (24 a 48 horas hábiles) y las consultas de saldo requerirán solicitud manual vía ticket.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/40 text-sm space-y-2">
                <h3 className="font-bold text-pink-900 dark:text-pink-200">4.2 Servicio de Fianza de Respaldo (+3.6% sobre el capital)</h3>
                <p>Beneficios de garantía y respaldo:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Prórroga de hasta 2 días:</strong> Si un día no puedes pagar por imprevisto o pico y placa, cuentas con hasta 48 horas de gracia sin cobro de mora.</li>
                  <li><strong>Cero afectación de historial:</strong> No afecta tu historial crediticio ni calificación interna en la plataforma.</li>
                  <li><strong>Acumulación de prórrogas:</strong> Si nunca las has utilizado, se acumulan para futuros créditos solicitados.</li>
                </ul>
                <p className="text-xs text-amber-800 dark:text-amber-300 pt-1">
                  <strong>En caso de no autorizar:</strong> Cualquier retraso o impago causará de inmediato intereses de mora legales y suspensión de renovaciones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm space-y-2">
                <h3 className="font-bold text-foreground">5. Inmutabilidad de Plazo y Forma de Pago</h3>
                <p className="font-semibold text-foreground">
                  "La persona no puede cambiar ni el plazo ni la forma de pago después de tomado el crédito."
                </p>
                <p className="text-xs text-muted-foreground">
                  Una vez formalizada la solicitud y emitido el pagaré digital con la modalidad escogida (diario, semanal, quincenal o mensual), los términos quedan sellados de forma definitiva para la vida del crédito.
                </p>
              </div>
            </div>
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
