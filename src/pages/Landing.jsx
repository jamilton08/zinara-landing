import { C } from "../tokens";
import { SectionDivider } from "../components/Visuals";
import {
  Hero, HowItWorks, Vision, TechSpecs, DevSection, CTA,
} from "../components/sections";

export default function Landing() {
  return (
    <>
      <Hero />
      <SectionDivider color={C.purple} />
      <HowItWorks />
      <SectionDivider color={C.teal} />
      <Vision />
      <SectionDivider color={C.teal} />
      <TechSpecs />
      <SectionDivider color={C.purple} />
      <DevSection />
      <SectionDivider color={C.teal} />
      <CTA />
    </>
  );
}
