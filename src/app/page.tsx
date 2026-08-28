import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SimulateSection } from "@/components/SimulateSection";
import { Simulator } from "@/components/Simulator";
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
        <Hero />
        <SectionDivider amplitude="soft" from="#ffffff" to="#f7f9fa" />
        <SimulateSection>
          <Simulator />
        </SimulateSection>
        <SectionDivider amplitude="soft" from="#f7f9fa" to="#ffffff" />
        <Requirements />
        <SectionDivider amplitude="medium" from="#ffffff" to="#e8f2dd" />
        <HowItWorks />
        <SectionDivider amplitude="medium" from="#e8f2dd" to="#ffffff" />
        <Faq />
        <SectionDivider amplitude="bold" from="#ffffff" to="#0a2150" />
        <CtaBanner />
      </main>
      <Footer />

      {/* landing-only overlays */}
      <LandingOverlays />
    </>
  );
}
