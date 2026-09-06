import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
import { Benefits } from "@/components/Benefits";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { LandingOverlays } from "@/components/LandingOverlays";
import { SectionDivider } from "@/components/SectionDivider";
import { SimulatorProvider } from "@/components/simulator-store";
import { config } from "@/lib/config";
import { getInitialRates, type RuntimeRatesConfig } from "@/lib/rates-config";

/** ISR: revalidate the server-seeded rates every 5 minutes so the SSR cuota
 *  stays in sync with Core without losing CDN cache. */
export const revalidate = 300;

/** Static fallback used when Core is unreachable at build/revalidation time. */
const STATIC_RATES: RuntimeRatesConfig = {
  monthlyRate: config.credit.monthlyRate,
  amountMin: config.simulator.amountMin,
  amountMax: config.simulator.amountMax,
  termOptions: config.simulator.termOptions,
};

export default async function Home() {
  const { rates } = await getInitialRates(
    config.ratesConfigEndpoint,
    STATIC_RATES,
  );

  return (
    <SimulatorProvider initialRates={rates}>
      <Nav />
      <main>
        {/* 1. Hero — full-bleed, foto + titular + un solo CTA */}
        <Hero />

        {/* 2. Simulador de crédito (preserved intact) */}
        <SimulateSection>
          <Simulator />
        </SimulateSection>

        {/* 2.5 Beneficios — 4 tarjetas planas estilo inDrive con imagen panorámica */}
        <Benefits />

        {/* 4. Cómo funciona — reservado para el futuro GSAP Interactive Phone Journey (ver roadmap spec) */}
        {/* <HowItWorks /> */}

        {/* 6. FAQ — stack centrado */}
        <Faq />

        {/* 7. CTA final — transición viscoelastic horizon a oscuro con halo luminoso */}
        <SectionDivider amplitude="bold" from="var(--background)" to="var(--color-primary-dark)" />
        <CtaBanner />
      </main>
      <Footer />

      {/* landing-only overlays (sticky bar, resume nudge, apply modal) */}
      <LandingOverlays />
    </SimulatorProvider>
  );
}
