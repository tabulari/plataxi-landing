import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
import { Benefits } from "@/components/Benefits";
import { Faq } from "@/components/Faq";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { LandingOverlays } from "@/components/LandingOverlays";
import { SectionDivider } from "@/components/SectionDivider";

export default async function Home() {
  // Los rates los siembra el layout (único SimulatorProvider, force-dynamic):
  // esta página solo consume el store, sin re-sembrar.
  return (
    <>
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
    </>
  );
}
