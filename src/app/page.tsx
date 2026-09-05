import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
import { Benefits } from "@/components/Benefits";
import { Requirements } from "@/components/Requirements";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
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
        {/* 1. Hero — full-bleed, foto + titular + un solo CTA */}
        <Hero />

        {/* 2. Simulador de crédito (preserved intact) */}
        <SectionDivider amplitude="soft" from="var(--background)" to="var(--background)" waveColor="var(--color-secondary-surface)" />
        <SimulateSection>
          <Simulator />
        </SimulateSection>

        {/* 2.5 Beneficios — 4 tarjetas planas estilo inDrive con imagen panorámica */}
        <SectionDivider amplitude="soft" from="var(--background)" to="var(--background)" waveColor="var(--color-secondary-surface)" flip />
        <Benefits />

        {/* 3. Requisitos — imagen + lista vertical */}
        <SectionDivider amplitude="soft" from="var(--background)" to="var(--background)" waveColor="var(--color-secondary-surface)" flip />
        <Requirements />

        {/* 5. Cómo funciona — 3 pasos */}
        <SectionDivider amplitude="medium" from="var(--background)" to="var(--background)" waveColor="var(--color-secondary-surface)" />
        <HowItWorks />

        {/* 6. Testimonios — quotes de conductores reales */}
        <SectionDivider amplitude="soft" from="var(--background)" to="var(--background)" waveColor="var(--color-secondary-surface)" flip />
        <Testimonials />

        {/* 7. FAQ — stack centrado */}
        <SectionDivider amplitude="soft" from="var(--background)" to="var(--background)" waveColor="var(--color-secondary-surface)" flip />
        <Faq />

        {/* 8. CTA final — transición a oscuro con borde crema */}
        <SectionDivider amplitude="bold" from="var(--background)" to="var(--color-primary-dark)" waveColor="var(--color-secondary-surface)" />
        <CtaBanner />
      </main>
      <Footer />

      {/* landing-only overlays (sticky bar, resume nudge, apply modal) */}
      <LandingOverlays />
    </>
  );
}
