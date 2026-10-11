import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { LandingOverlays } from "@/components/LandingOverlays";

export default async function Home() {
  // Los rates los siembra el layout (único SimulatorProvider, force-dynamic):
  // esta página solo consume el store, sin re-sembrar.
  return (
    <>
      <Nav />
      <main className="bg-secondary-surface">
        {/* 1. Hero — full-bleed, foto + titular + un solo CTA */}
        <Hero />

        {/* 2. Simulador de crédito */}
        <SimulateSection>
          <Simulator />
        </SimulateSection>

        {/* 3. Cómo funciona & Beneficios — card amplia estilo inDrive + 4 cards */}
        <HowItWorks />

        {/* 4. Preguntas frecuentes — acordeón sin etiqueta superior */}
        <Faq />
      </main>
      <Footer />

      {/* landing-only overlays (sticky bar, resume nudge, apply modal) */}
      <LandingOverlays />
    </>
  );
}
