import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import { config } from "@/lib/config";
import { fmtCOP } from "@/lib/credit";
import { StructuredData } from "@/components/StructuredData";
import { SiteUiProvider } from "@/components/site-ui";
import { SimulatorProvider } from "@/components/simulator-store";
import { RevealController } from "@/components/RevealController";
import { GsapProvider } from "@/components/GsapProvider";
import { PageLoader } from "@/components/PageLoader";
import "./globals.css";

// Roboto is the Plataxi typeface. Both CSS vars map to Roboto so existing
// `font-sans` / `font-display` usages keep working (display = heavy weights).
const jakarta = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-jakarta",
  display: "swap",
});

const display = Roboto({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
  display: "swap",
});

const MAX_AMOUNT_DISPLAY = `$${fmtCOP(config.simulator.amountMax).replace(',00','')}`;
const DESCRIPTION =
  `Crédito digital en Colombia hasta ${MAX_AMOUNT_DISPLAY}. Respuesta en minutos, tasa clara y sin papeles. Simula tu cuota y solicita 100% en línea.`;
const OG_TITLE = `${config.brandName} — Crédito digital hasta ${MAX_AMOUNT_DISPLAY}`;
const BRAND_ASSET_VERSION = '3ef966e';

// metadataBase makes OG/canonical URLs absolute (⚠️ NEXT_PUBLIC_SITE_URL must be
// the real domain or WhatsApp/social previews break).
export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: `${config.brandName} — Crédito digital 100% en línea`,
  description: DESCRIPTION,
  authors: [{ name: config.brandName }],
  alternates: { canonical: "/", languages: { "es-CO": "/" } },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: config.brandName,
    locale: "es_CO",
    url: new URL("/", config.siteUrl).href,
    title: OG_TITLE,
    description:
      "Respuesta en minutos. Tasa clara. Sin papeles. Simula tu crédito y solicita 100% en línea.",
    images: [
      { url: "/og-image.webp", width: 1200, height: 630, alt: OG_TITLE, type: "image/webp" },
      { url: "/og-image.png", width: 1200, height: 630, alt: OG_TITLE, type: "image/png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description:
      "Respuesta en minutos. Tasa clara. Sin papeles. Simula y solicita 100% en línea.",
    images: ["/og-image.webp", "/og-image.png"],
  },
  icons: {
    icon: [
      { url: `/favicon.svg?v=${BRAND_ASSET_VERSION}`, type: "image/svg+xml" },
      { url: `/favicon-32.png?v=${BRAND_ASSET_VERSION}`, type: "image/png", sizes: "32x32" },
    ],
    apple: `/apple-touch-icon.png?v=${BRAND_ASSET_VERSION}`,
  },
};

export const viewport: Viewport = {
  themeColor: config.colors.navy,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${jakarta.variable} ${display.variable}`} suppressHydrationWarning>
      <body>
        {/* Set the JS flag before paint so `.reveal` content is never stranded
            hidden without JS (matches the prototype's inline head script). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />

        <StructuredData />

        <a className="skip-link" href="#simula">
          Saltar al contenido
        </a>

        <noscript>
          <div className="noscript-banner">
            <strong>Activa JavaScript</strong> para usar el simulador y
            solicitar tu crédito en línea. Mientras tanto, puedes escribirnos por{" "}
            <a
              href={`https://wa.me/${config.whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>{" "}
            y te ayudamos con tu simulación.
          </div>
        </noscript>

        <SiteUiProvider>
          <GsapProvider>
            <PageLoader />
            <SimulatorProvider>{children}</SimulatorProvider>
          </GsapProvider>
        </SiteUiProvider>

        <RevealController />

        {config.gtmId && (
          <>
            <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.gtmId}');`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
