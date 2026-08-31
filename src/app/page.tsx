import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
import { Benefits } from "@/components/Benefits";
import { Requirements } from "@/components/Requirements";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { LandingOverlays } from "@/components/LandingOverlays";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* 1. Hero — split layout, yellow accents, stats */}
        <Hero />

        {/* 2. Simulador de crédito (preserved intact) */}
        <SectionDivider amplitude="soft" from="#fffbe0" to="#ffffff" />
        <SimulateSection>
          <Simulator />
        </SimulateSection>

        {/* 3. Beneficios — 3-up cards (inDrive-style) */}
        <SectionDivider amplitude="soft" from="#ffffff" to="#fffbe0" />
        <Benefits />

        {/* 4. Requisitos — 2×2 grid */}
        <SectionDivider amplitude="soft" from="#fffbe0" to="#ffffff" />
        <Requirements />

        {/* 5. Cómo funciona — numbered journey */}
        <SectionDivider amplitude="medium" from="#ffffff" to="#fffbe0" />
        <HowItWorks />

        {/* 6. FAQ — 2-column accordion */}
        <SectionDivider amplitude="soft" from="#fffbe0" to="#ffffff" />
        <Faq />

        {/* 8. CTA final — transición a oscuro */}
        <SectionDivider amplitude="bold" from="#ffffff" to="#111110" />
        <CtaBanner />
      </main>
      <Footer />

      {/* landing-only overlays (sticky bar, resume nudge, apply modal) */}
      <LandingOverlays />
    </>
  );
}
