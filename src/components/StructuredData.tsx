import { config } from "@/lib/config";
import { fmtCOP } from "@/lib/credit";
import { FAQS } from "@/lib/faqs";

const BRAND_ASSET_VERSION = '3ef966e';

/**
 * JSON-LD structured data (ported from the prototype <head>): FinancialService
 * + FAQPage (eligible for Google rich results). URLs/telephone/address are
 * config-driven (⚠️ placeholders until set); the FAQ list is the single source
 * shared with the FAQ accordion.
 */
export function StructuredData() {
  const base = config.siteUrl.replace(/\/$/, "");

  const financialService = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: config.brandName,
    description:
      `Crédito digital en Colombia hasta $${fmtCOP(config.simulator.amountMax).replace(',00','')}. Respuesta en minutos, tasa clara y sin papeles. Simula tu cuota y solicita 100% en línea.`,
    url: `${base}/`,
    logo: `${base}/plataxi-logo.svg?v=${BRAND_ASSET_VERSION}`,
    image: `${base}/og-image.png`,
    areaServed: { "@type": "Country", name: "Colombia" },
    currenciesAccepted: "COP",
    availableLanguage: "es",
    serviceType: "Crédito de consumo digital",
    telephone: config.company.contactPhone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CO",
      streetAddress: config.company.address,
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, verdict, explanation }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: `${verdict} ${explanation}` },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
